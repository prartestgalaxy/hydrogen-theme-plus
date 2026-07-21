import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindStyles from '~/styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';
import {GLOBAL_QUERY} from '../app/sanity/queries/global';
import {WISHLIST_SETTINGS_QUERY} from '~/sanity/queries/wishlist';
import {Aside} from '~/components/Aside';
import {WishlistProvider} from '~/context/WishlistContext';
import {FREE_SHIPPING_SETTINGS_QUERY} from '~/sanity/queries/freeShipping';
import {Suspense, useId, useEffect} from 'react';
import {Await, Link, NavLink, useParams} from 'react-router';
import {GlobalLoader} from './components/GlobalLoader';
import {GLOBAL_SETTINGS_QUERY} from '~/sanity/queries/GlobalSettingQuery';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return defaultShouldRevalidate;
};

import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const {request, context} = args;
  const {i18n} = context.storefront;

  // ✅ Get login status from cookies
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((c) => c.split('=')),
  );
  const accessToken = cookies.customerAccessToken;
  const isLoggedIn = !!accessToken;
  const {customerAccount} = context;

  let wishlist = {products: []};

  if (isLoggedIn) {
    try {
      const customerData = await customerAccount.query(`
      query {
        customer {
          metafield(namespace: "custom", key: "wishlist") {
            value
          }
        }
      }
    `);

      const raw = customerData?.customer?.metafield?.value;

      wishlist = raw ? JSON.parse(raw) : {products: []};
    } catch (err) {
      //temp commented
      // console.error('Wishlist fetch error:', err);
    }
  }
  // ✅ Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // ✅ Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // ✅ Fetch wishlist settings from Sanity
  let wishlistSettings;
  try {
    wishlistSettings = await context.sanityClient.fetch(
      WISHLIST_SETTINGS_QUERY,
    );
  } catch (error) {
    console.error('Error fetching wishlist settings:', error);
    wishlistSettings = null;
  }

  //freeship
  let freeShippingSettings;
  try {
    freeShippingSettings = await context.sanityClient.fetch(
      FREE_SHIPPING_SETTINGS_QUERY,
    );
  } catch (error) {
    console.error('Error fetching free shipping settings:', error);
    freeShippingSettings = null;
  }

  const {storefront, env} = context;

  return {
    ...deferredData,
    ...criticalData,
    isLoggedIn,
    wishlist,
    wishlistSettings,
    freeShippingSettings,
    selectedLocale: i18n,
    storefront,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const {storefront, sanityClient} = context;

  const [
    sanityData,
    {localization},
    {shop},
    collectionsData,
    tagsData,
    quickPicksData,
  ] = await Promise.all([
    sanityClient.fetch(GLOBAL_QUERY).catch((error) => {
      console.error('Sanity global query failed:', error);
      return null;
    }),
    storefront.query(LOCALIZATION_QUERY),
    storefront.query(SHOP_NAME_QUERY),
    // Fetch top 5 collections
    storefront
      .query(COLLECTIONS_QUERY, {
        variables: {first: 5},
        cache: storefront.CacheLong(),
      })
      .catch((error) => {
        console.error('Collections query failed:', error);
        return {collections: {edges: []}};
      }),
    // Fetch top product tags
    storefront
      .query(TOP_PRODUCT_TAGS_QUERY, {
        cache: storefront.CacheLong(),
      })
      .catch((error) => {
        console.error('Product tags query failed:', error);
        return {productTags: {edges: []}};
      }),
    // Fetch quick picks products (best selling or latest)
    storefront
      .query(QUICK_PICKS_QUERY, {
        variables: {
          first: 5,
          sortKey: 'BEST_SELLING',
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
        cache: storefront.CacheLong(),
      })
      .catch((error) => {
        console.error('Quick picks query failed:', error);
        return {products: {edges: []}};
      }),
  ]);

  const {header} = await storefront
    .query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    })
    .catch((error) => {
      console.error('Header query failed:', error);
      return {header: null};
    });

  let globalSettings;
  try {
    globalSettings = await sanityClient.fetch(GLOBAL_SETTINGS_QUERY);
  } catch (error) {
    console.error('Global Setting Query Failed:', error);
    globalSettings = null;
  }

  // Format the collections data
  const collections =
    collectionsData?.collections?.edges?.map((edge) => edge.node) || [];

  // Format the tags data
  const topTags = tagsData?.productTags?.edges?.map((edge) => edge.node) || [];

  // Format the quick picks data
  const quickPicks =
    quickPicksData?.products?.edges?.map((edge) => edge.node) || [];

  // Return all data - NO DUPLICATES
  return {
    header,
    globalSettings, // Single instance of globalSettings
    sanityData,
    localization,
    shopName: shop.name,
    topCollections: collections,
    topProductTags: topTags,
    quickPicks: quickPicks,
  };
}

/**
 * Load data for rendering content below the fold.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer',
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    cart: cart.get({
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    }),
    footer,
  };
}

/**
 * @param {{children?: React.ReactNode}}
 */
export function Layout({children}) {
  const nonce = useNonce();

  const data = useRouteLoaderData('root');
  const getFontClass = (fontFamily) => {
    if (!fontFamily) return 'font-montserrat';
    if (fontFamily.includes('Montserrat')) return 'font-montserrat';
    return 'font-montserrat';
  };
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <link rel="stylesheet" href={tailwindStyles} />
        <Meta />
        <Links />
      </head>
      <body className={getFontClass(data?.globalSettings?.fontFamily)}>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <Aside.Provider>
              <WishlistProvider
                settings={data.wishlistSettings}
                initialWishlist={data?.wishlist}
                isLoggedIn={data?.isLoggedIn}
              >
                <PageLayout {...data}>{children}</PageLayout>
              </WishlistProvider>
            </Aside.Provider>
          </Analytics.Provider>
        ) : (
          children
        )}

        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <GlobalLoader />
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}

/** @typedef {LoaderReturnData} RootLoader */
/** @typedef {import('react-router').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('./+types/root').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

const LOCALIZATION_QUERY = `#graphql
  query Localization {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
          symbol
        }
      }
    }
  }
`;

const SHOP_NAME_QUERY = `#graphql
  query ShopName {
    shop {
      name
    }
  }
`;

const COLLECTIONS_QUERY = `#graphql
  query TopCollections($first: Int!) {
    collections(first: $first, sortKey: UPDATED_AT) {
      edges {
        node {
          id
          title
          handle
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

const TOP_PRODUCT_TAGS_QUERY = `#graphql
  query TopProductTags {
    productTags(first: 5) {
      edges {
        node
      }
    }
  }
`;

const QUICK_PICKS_QUERY = `#graphql
  query QuickPicks(
    $first: Int!
    $sortKey: ProductSortKeys
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: $sortKey) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            id
            url
            altText
            width
            height
          }
          variants(first: 1) {
            nodes {
              id
              availableForSale
              quantityAvailable
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
