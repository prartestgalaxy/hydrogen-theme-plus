// Virtual entry point for the app
import { storefrontRedirect } from '@shopify/hydrogen';
import { createRequestHandler } from '@shopify/hydrogen/oxygen';
import { createHydrogenRouterContext } from '~/lib/context';
 
 
/**
* Export a fetch handler in module format.
*/
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   * @return {Promise<Response>}
   */
  async fetch(request, env, executionContext) {
    try {
      const { hydrogenContext, customerAccount }= await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );
 
      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        // eslint-disable-next-line import/no-unresolved
        build: await import('virtual:react-router/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });
 
      const response = await handleRequest(request);
 
      // response.headers.set(
      //   "Content-Security-Policy",
      //   "default-src 'self'; img-src * data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com; style-src 'self' 'unsafe-inline';"
      // );
 
      response.headers.set(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "img-src * data: blob:",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com",
          "script-src-elem 'self' 'unsafe-inline' https://cdn.shopify.com",
          "connect-src 'self' https://monorail-edge.shopifysvc.com https://cdn.shopify.com",
          "style-src 'self' 'unsafe-inline'",
          "frame-src 'self' https: https://*.trycloudflare.com",
          "frame-ancestors 'self' https://*.shopify.com https://admin.shopify.com",
        ].join('; ')
      );
 
      // Remove X-Frame-Options to allow CSP frame-ancestors to take precedence
      // response.headers.delete('X-Frame-Options');
 
 
      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }
 
      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }
 
      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', { status: 500 });
    }
  },
};