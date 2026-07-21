import { Await, useLoaderData, Link, useRouteLoaderData } from 'react-router';
import { Suspense } from 'react';
import { Image } from '@shopify/hydrogen';
import { ProductItem } from '~/components/ProductItem';
import { defineQuery } from 'groq'
import { HOME_QUERY } from '~/sanity/queries/home'
import { Modules } from '~/components/modules'
import groq from 'groq';
import { useState, useEffect } from 'react';
// import { FAQ_QUERY } from '../sanity/queries/faq';
import { GLOBAL_SETTINGS_QUERY } from '../sanity/queries/GlobalSettingQuery';


/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{ title: 'Hydrogen | Home' }];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const { context,request } = args;
  const { i18n } = context.storefront;
  const deferredData = loadDeferredData({ context, i18n });
  const criticalData = await loadCriticalData({ context,request, i18n });
  return { ...deferredData, ...criticalData, i18n };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */

async function loadCriticalData({ context,request, i18n }) {
  const { sanityClient, storefront } = context;

  // ✅ CHECK IF USER IS LOGGED IN
    const cookie = request.headers.get('cookie') || ''; 
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];
  const isLoggedIn = !!accessToken;

  // ✅ FETCH WISHLIST SETTINGS
  let wishlistSettings;
  try {
    wishlistSettings = await sanityClient.fetch(WISHLIST_SETTINGS_QUERY);
  } catch (error) {
    console.error('Error fetching wishlist settings:', error);
    wishlistSettings = null;
  }

  // ✅ PROVIDE DEFAULT VALUES IF SETTINGS ARE NULL
  const safeSettings = wishlistSettings || {
    enabled: false,
    requireLogin: true,
    heartIconColor: 'red-500',
    buttonPosition: 'top-right',
    maxItems: 0,
    showCount: true,
    showNotification: true
  };

  let wishlist = [];

  // ✅ FETCH WISHLIST IF ENABLED AND USER IS LOGGED IN
  if (safeSettings.enabled && isLoggedIn && accessToken) {
    try {
      // Get customer ID first
      const customerRes = await storefront.query(
        `
        query getCustomer($customerAccessToken: String!) {
          customer(customerAccessToken: $customerAccessToken) {
            id
          }
        }
        `,
        {
          variables: {
            customerAccessToken: accessToken,
          },
        }
      );

      const customerId = customerRes?.customer?.id;

      if (customerId) {
        // Get wishlist metafield using Admin API
        const adminQuery = `
          query getCustomerWishlist($id: ID!) {
            customer(id: $id) {
              id
              wishlist: metafield(namespace: "custom", key: "wishlist") {
                id
                namespace
                key
                value
                type
              }
            }
          }
        `;

        const adminRes = await fetch(
          `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': context.env.PRIVATE_ADMIN_TOKEN,
            },
            body: JSON.stringify({
              query: adminQuery,
              variables: { id: customerId },
            }),
          }
        );

        const adminData = await adminRes.json();
        const metafield = adminData?.data?.customer?.wishlist;

        if (metafield?.value) {
          try {
            const parsed = JSON.parse(metafield.value);
            wishlist = parsed.products || [];
          } catch (e) {
            wishlist = [];
          }
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }

  // const faqData = await context.sanityClient.fetch(FAQ_QUERY);

  // 1. Fetch static Sanity Data
  const [homeData, allProducts, allCollections] = await Promise.all([
    sanityClient.fetch(HOME_QUERY).catch(() => ({ modules: [] })),
    sanityClient.fetch(`*[_type == "product"]{
      _id, "title": store.title, "slug": store.slug.current,
      "price": store.priceRange.minVariantPrice,
      "compareAtPrice": store.compareAtPriceRange.maxVariantPrice,
      "imageUrl": store.previewImageUrl, "createdAt": _createdAt,
      "store": store
    }`).catch(() => []),
    sanityClient.fetch(`*[_type == "collection"]{
      _id, "title": store.title, "handle": store.slug.current, "imageUrl": store.imageUrl
    }`).catch(() => []),
  ]);

  // 2. ✅ Fetch LIVE Shopify Prices (Added Cache Control)
  // const { products: shopifyProducts } = await storefront.query(
  //   `#graphql
  //   query LocalizedPrices($country: CountryCode, $language: LanguageCode)
  //   @inContext(country: $country, language: $language) {
  //     products(first: 100) {
  //       nodes {
  //         handle
  //         priceRange {
  //           minVariantPrice { amount currencyCode }
  //         }
  //         compareAtPriceRange {
  //           maxVariantPrice { amount currencyCode }
  //         }
  //       }
  //     }
  //   }`,
  //   {
  //     variables: {
  //       country: i18n.country || 'US',
  //       language: i18n.language,
  //     },
  //   }
  // ).catch(() => ({ products: { nodes: [] } }));

  // 2. ✅ Fetch LIVE Shopify Prices + Variant IDs
  const { products: shopifyProducts } = await storefront.query(
    `#graphql
    query LocalizedPrices($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      products(first: 100) {
        nodes {
          handle
          id
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            maxVariantPrice { amount currencyCode }
          }
          # ADD THIS SECTION
          variants(first: 1) {
            nodes {
              id
            }
          }
        }
      }
    }`,
    {
      variables: {
        country: i18n.country || 'US',
        language: i18n.language,
      },
    }
  ).catch(() => ({ products: { nodes: [] } }));



  // 3. ✅ Merge live market prices (Fixing the Mutation Bug)
  // const mergedProducts = allProducts.map(sanityProduct => {
  //   const productCopy = JSON.parse(JSON.stringify(sanityProduct));

  //   const liveShopifyData = shopifyProducts?.nodes?.find(p => p.handle === productCopy.slug);

  //   if (liveShopifyData) {
  //     // Overwrite static Sanity prices on our fresh copy
  //     productCopy.price = liveShopifyData.priceRange.minVariantPrice.amount;

  //     if (liveShopifyData.compareAtPriceRange?.maxVariantPrice) {
  //       productCopy.compareAtPrice = liveShopifyData.compareAtPriceRange.maxVariantPrice.amount;
  //     }

  //     if (!productCopy.store) productCopy.store = {};
  //     productCopy.store.priceRange = liveShopifyData.priceRange;
  //   }

  //   return productCopy;
  // });

  // 3. ✅ Merge live market prices and variant IDs
  const mergedProducts = allProducts.map(sanityProduct => {
    const productCopy = JSON.parse(JSON.stringify(sanityProduct));
    const liveShopifyData = shopifyProducts?.nodes?.find(p => p.handle === productCopy.slug);

    if (liveShopifyData) {
      productCopy.price = liveShopifyData.priceRange.minVariantPrice.amount;

      if (liveShopifyData.compareAtPriceRange?.maxVariantPrice) {
        productCopy.compareAtPrice = liveShopifyData.compareAtPriceRange.maxVariantPrice.amount;
      }

      if (!productCopy.store) productCopy.store = {};
      
      // Update price range
      productCopy.store.priceRange = liveShopifyData.priceRange;

      // Ensure the variant ID from Shopify is merged into the store object
      const firstVariantId = liveShopifyData.variants?.nodes[0]?.id;
      if (firstVariantId) {
        // We structure it so the 'transform' function can read the _ref or ID
        productCopy.store.variants = [
          {
            _ref: firstVariantId, // Injecting the real GID here
            _type: 'reference'
          }
        ];
      }
    }

    return productCopy;
  });

  if (!homeData?.modules) return { homeData: { modules: [] } };

  // 4. Resolve modules using the MERGED products, not the static ones
  const modulesWithData = homeData.modules.map((module) => {
    if (module._type === 'productGrid' || module._type === 'newArrivals') {
      const limit = Number(module.limit) || 8;
      let resolvedProducts = [];

      // if (module._type === 'newArrivals') {
      //   resolvedProducts = [...mergedProducts] // <-- Use mergedProducts here
      //     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      //     .slice(0, limit);
      // } else {
        resolvedProducts = module.sourceType === 'manual'
          ? (module.products?.map(ref => mergedProducts.find(p => p._id === ref._ref)).filter(Boolean) || [])
          : mergedProducts.slice(0, limit); // <-- And here
      // }

  // console.log("Products resolved products : ", JSON.stringify(resolvedProducts,null,2));

      
      return { ...module, resolvedProducts };
    }

    // ... (Keep your collectionCarousel logic exactly the same)
    if (module._type === 'collectionCarousel') {
      const resolvedCollections = module.collections
        ?.map(ref => allCollections.find(col => col._id === ref._ref))
        .filter(Boolean) || [];
      return { ...module, resolvedCollections };
    }

    return module;
  });

  let globalSettingsData;
  try {
    globalSettingsData = await sanityClient.fetch(GLOBAL_SETTINGS_QUERY);
  } catch (error) {
    console.error('Global Setting Query Failed:', error);
    globalSettingsData = null;
  }
  

  return { 
    homeData: { ...homeData, modules: modulesWithData },
    wishlist,
    isWishlistEnabled: safeSettings.enabled,
    isLoggedIn,
    globalSettingsData
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({ context, i18n }) {
  if (!i18n) {
    console.error('i18n context missing in loadDeferredData');
    return { recommendedProducts: null };
  }

  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        country: i18n.country || 'US',
        language: i18n.language
      },
      cache: context.storefront.CacheNone()
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData();
  const rootData = useRouteLoaderData('root');

  const currentCountry = data?.i18n?.country || 'US';

  const activeCountryData = rootData?.localization?.availableCountries?.find(
    (country) => country.isoCode === currentCountry
  );

  const globalSettingsData = data?.globalSettingsData;
  
  const activeCurrency = activeCountryData?.currency?.isoCode || 'USD';

  // Check if sanity data exists
  const hasModules = data?.homeData?.modules && data.homeData.modules.length > 0;

  // const faqData= data?.homeData?.faqData;

  if (!hasModules) {
    return <NoSanityData />;
  }

  return (
    <div className="home" key={currentCountry}>
      <Modules
        modules={data.homeData.modules}
        isLoggedIn={data.isLoggedIn || false}
        wishlistSettings={{ enabled: data.isWishlistEnabled }}
        activeCurrency={activeCurrency}
        activeCountry={currentCountry}
        wishlist={data.wishlist} // Pass wishlist data
        globalSettingsData={globalSettingsData}
      />
    </div>
  );
}

/** Full screen fallback if Sanity data is missing */
function NoSanityData() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 text-gray-800 text-center p-8">
      <h1>No Sanity Data Found</h1>
      <p>
        The homepage content is missing from Sanity. <br />
        Please check your Sanity project or environment variables.
      </p>
    </div>
  );
}

// Add this query constant
const WISHLIST_SETTINGS_QUERY = groq`*[_type == "wishlistSettings"][0]{
  enabled,
  requireLogin,
  heartIconColor,
  buttonPosition,
  maxItems,
  showCount,
  showNotification
}`;

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({ collection }) {
  if (!collection) return null;
  const image = collection?.image;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // force remove blur after hydration
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image
            data={image}
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   400px"
            loading="lazy"
            loaderOptions={{ scale: 0.1 }}
            className={`filter transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
            onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
          />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({ products }) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const ALL_PRODUCTS_QUERY = groq`*[_type == "product"] {
  _id,
  _createdAt,
  "title": store.title,
  "slug": store.slug.current,
  "price": store.priceRange.minVariantPrice,
  "compareAtPrice": store.compareAtPriceRange.maxVariantPrice,
  "imageUrl": store.previewImageUrl,
  "secondaryImageUrl": store.images[1].asset->url
}`;

const ALL_COLLECTIONS_QUERY = groq`
  *[_id in $ids]{
    _id,
    "title": store.title,
    "gid": store.gid,
    "shopifyId": store.id,
    "imageUrl": store.imageUrl
  }
`;

const LATEST_PRODUCTS_QUERY = groq`
*[_type == "product"] | order(_createdAt desc)[0...10]{
  _id,
  "title": store.title,
  "slug": store.slug.current,
  "price": store.priceRange.minVariantPrice,
  "image": store.previewImageUrl
}
`

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const HOMEPAGE_QUERY = defineQuery(`*[_id == "home"][0]{
  _id,
  title,
  hero {
    title,
    description,
    image {
      asset->{
        _id,
        url
      },
      alt
    }
  },
  modules[] {
    _type,
    _type == "productShowcase" => {
      products[]-> {
        _id,
        store {
          title,
          slug,
          previewImageUrl
        }
      }
    }
  }
}`)

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */