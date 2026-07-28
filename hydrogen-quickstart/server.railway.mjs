/**
 * Custom Node.js server for Railway deployment.
 * Bridges between Node.js HTTP and the Hydrogen Cloudflare Worker handler
 * WITHOUT using workerd/miniflare (which crashes in Railway containers).
 */
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { webcrypto } from 'node:crypto';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = parseInt(process.env.PORT || '3000', 10);
const CLIENT_DIR = resolve(__dirname, 'dist/client');

// ---------------------------------------------------------------------------
// Polyfill Cloudflare Workers globals that the Hydrogen bundle expects
// ---------------------------------------------------------------------------

// 1. crypto.subtle — available in Node 18+ via globalThis.crypto but map it
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// 2. caches — Cloudflare Cache API (in-memory stub for Node.js)
if (!globalThis.caches) {
  const cacheStore = new Map();

  class NodeCache {
    #store = new Map();

    async match(request) {
      const url = typeof request === 'string' ? request : request.url;
      return this.#store.get(url) ?? undefined;
    }
    async put(request, response) {
      const url = typeof request === 'string' ? request : request.url;
      this.#store.set(url, response.clone());
    }
    async delete(request) {
      const url = typeof request === 'string' ? request : request.url;
      return this.#store.delete(url);
    }
  }

  globalThis.caches = {
    async open(cacheName) {
      if (!cacheStore.has(cacheName)) cacheStore.set(cacheName, new NodeCache());
      return cacheStore.get(cacheName);
    },
    async has(cacheName) { return cacheStore.has(cacheName); },
    async delete(cacheName) { return cacheStore.delete(cacheName); },
    async keys() { return Array.from(cacheStore.keys()); },
    async match(request) { return undefined; },
    default: new NodeCache(),
  };
}

// MIME types for static assets
const MIME = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.map': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'text/xml',
  '.html': 'text/html',
};

// Load the Hydrogen worker module (Cloudflare Worker Fetch API compatible)
console.log('Loading Hydrogen worker module...');
const workerModule = await import('./dist/server/index.js');
const worker = workerModule.default;
console.log('Worker module loaded ✓');

// Build the env bindings the worker expects
const workerEnv = {
  SESSION_SECRET: process.env.SESSION_SECRET || 'fallback-secret',
  PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || '',
  PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
  PUBLIC_CHECKOUT_DOMAIN: process.env.PUBLIC_CHECKOUT_DOMAIN || '',
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID || '',
  PUBLIC_CUSTOMER_ACCOUNT_API_URL: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL || '',
  PRIVATE_ADMIN_TOKEN: process.env.PRIVATE_ADMIN_TOKEN || '',
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID || '',
  SANITY_DATASET: process.env.SANITY_DATASET || 'production',
  SANITY_API_VERSION: process.env.SANITY_API_VERSION || '2023-03-30',
  SHOP_ID: process.env.SHOP_ID || '',
};

// Minimal ExecutionContext stub
const ctx = {
  waitUntil: (promise) => { promise.catch(console.error); },
  passThroughOnException: () => {},
};

// Serve a static file from dist/client
async function serveStatic(filePath, res) {
  try {
    const stat = statSync(filePath);
    if (!stat.isFile()) return false;
    const ext = extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    const isImmutable = filePath.includes('/assets/');
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': stat.size,
      'Cache-Control': isImmutable
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600',
    });
    createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // --- Serve static assets from dist/client ---
  const pathname = url.pathname;
  if (pathname.startsWith('/assets/') || pathname === '/favicon.ico' || pathname === '/robots.txt') {
    const filePath = join(CLIENT_DIR, pathname);
    const served = await serveStatic(filePath, res);
    if (served) return;
  }

  // --- Forward all other requests to the Hydrogen worker ---
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value != null) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    const method = (req.method || 'GET').toUpperCase();
    const hasBody = !['GET', 'HEAD'].includes(method);

    const request = new Request(url.toString(), {
      method,
      headers,
      body: hasBody ? Readable.toWeb(req) : undefined,
      ...(hasBody ? { duplex: 'half' } : {}),
    });

    const response = await worker.fetch(request, workerEnv, ctx);

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      // Skip headers that Node.js manages automatically
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error('Worker fetch error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Hydrogen server running on http://0.0.0.0:${PORT}\n`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
