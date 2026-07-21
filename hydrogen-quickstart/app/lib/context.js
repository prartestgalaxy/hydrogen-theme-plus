import {createHydrogenContext, createCustomerAccountClient} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import { createAdminClient } from './adminClient';
import groq from 'groq';
import {createClient} from '@sanity/client';
import {createSanityContext} from 'hydrogen-sanity';



/**
 * Detects the locale (language/country) from the request URL
 * @param {Request} request
 * @param {Array} supportedCountries
 */
function getLocaleFromRequest(request, supportedCountries = ['US']) {
  const url = new URL(request.url);
  // const firstPart = url.pathname.split('/')[1]?.toUpperCase();
  let cleanPathname = url.pathname;
  if (cleanPathname.endsWith('.data')) {
    cleanPathname = cleanPathname.replace('.data', '');
  }

  // Now split the cleaned pathname
  const firstPart = cleanPathname.split('/')[1]?.toUpperCase();

  // List the country codes you enabled in Shopify Markets
  // const supportedCountries = ['NL', 'US', 'FR', 'AE','JP']; 
  // const supportedCountries = ['NL', 'US', 'FR', 'AE', 'JP', 'CN', 'IN', 'GB', 'AU'];
  
  if (supportedCountries.includes(firstPart)) {
    return {
      language: 'EN', // Keep EN for now unless you have translations
      country: firstPart,
    };
  }

  // Fallback for the default route (e.g., domain.com/)
  return {language: 'EN', country: 'US'};
}

// Define the additional context object
const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
  // These will be available as both context.propertyName and context.get(propertyContext)
  // Example of complex objects that could be added:
  // cms: await createCMSClient(env),
  // reviews: await createReviewsClient(env),
};

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 * @param {Request} request
 * @param {Env} env
 * @param {ExecutionContext} executionContext
 */
export async function createHydrogenRouterContext(
  request,
  env,
  executionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const activeCountriesQuery = `
    query GetActiveCountries {
      localization {
        availableCountries {
          isoCode
        }
      }
    }
  `;
  
  const response = await fetch(`https://${env.PUBLIC_STORE_DOMAIN}/api/2024-04/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    body: JSON.stringify({ query: activeCountriesQuery }),
  });
  
  const { data } = await response.json();
  const fetchedCountries = data?.localization?.availableCountries?.map((country) => country.isoCode) || ['US'];
  

// 1. GROQ querying client
const groqClient = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET || 'production',
  apiVersion: env.SANITY_API_VERSION || '2024-08-08',
  useCdn: process.env.NODE_ENV === 'production',
});

// 2. Studio / asset APIs
const sanityStudio = await createSanityContext({
  request,
  cache,
  waitUntil,
  client: {
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET || 'production',
    apiVersion: env.SANITY_API_VERSION || '2024-08-08',
    useCdn: process.env.NODE_ENV === 'production',
  },
});



  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: getLocaleFromRequest(request,fetchedCountries),
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
        extraVariables: {
          country: getLocaleFromRequest(request,fetchedCountries).country,
          language: getLocaleFromRequest(request, fetchedCountries).language,
        },
      },
    },
    // additionalContext,
    {
     ...additionalContext,
    sanityClient: groqClient,   // GROQ fetch client
    sanityStudio: sanityStudio, // hydrogen-sanity studio API
   },
  );

  const {admin} = createAdminClient({
    storeDomain : env.PUBLIC_STORE_DOMAIN,
    privateAdminToken : env.PRIVATE_ADMIN_TOKEN,
    adminApiVersion : '2024-04'
  })

  hydrogenContext.admin = admin;


  // Customer Account API client
  const customerAccount = createCustomerAccountClient({
    waitUntil,
    request,
    session,
    customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
    shopId: env.SHOP_ID,
    unstableB2b: true, // keep if you need B2B
  });

  return {hydrogenContext, customerAccount};

  
}
/** @typedef {Class<additionalContext>} AdditionalContextType */

