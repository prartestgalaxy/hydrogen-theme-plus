
// import { CartMain } from '~/components/CartMain';
// import { FreeShippingBar } from '~/components/FreeShippingBar';
// import { FREE_SHIPPING_SETTINGS_QUERY } from '~/sanity/queries/freeShipping';
// import { useLoaderData, useFetcher, useFetchers, useParams, data, useRouteLoaderData } from 'react-router';
// import { useEffect, useState } from 'react';
// import { CartForm } from '@shopify/hydrogen';
// import { RECOMMENDATIONS_SETTINGS_QUERY } from '~/sanity/queries/recommendations';
// import { RECENTLY_SETTINGS_QUERY } from '~/sanity/queries/recentlyViewed';
// import { Recommendations } from '~/components/Recommendations';
// import { RecentlyViewedSection } from '~/components/RecentlyViewed';
// import { CART_SETTINGS_QUERY } from '~/sanity/queries/cartpage';
// import LogoSlider from '~/components/LogoSlider';
// import FeatureHighlights from '~/components/FeatureHighlights';
// import { WISHLIST_SETTINGS_QUERY } from '~/sanity/queries/wishlist';

// /**
//  * Helper to get global data from root
//  */
// export function useGlobalData() {
//   const rootData = useRouteLoaderData('root');
//   return rootData?.globalSettings || null;
// }

// const RECOMMENDED_PRODUCT_FRAGMENT = `#graphql
//   fragment RecommendedProduct on Product {
//     id
//     title
//     handle
//     vendor
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//       maxVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     compareAtPriceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     featuredImage {
//       id
//       url
//       altText
//       width
//       height
//     }
//     images(first: 5) {
//       nodes {
//         id
//         url
//         altText
//         width
//         height
//       }
//     }
//     variants(first: 5) {
//       nodes {
//         id
//         availableForSale
//         price {
//           amount
//           currencyCode
//         }
//         compareAtPrice {
//           amount
//           currencyCode
//         }
//         image {
//           id
//           url
//           altText
//           width
//           height
//         }
//       }
//     }
//     productType
//     tags
//   }
// `;

// const RECOMMENDATIONS_QUERY = `#graphql
//   query getProductRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode)
//   @inContext(country: $country, language: $language) {
//     productRecommendations(productId: $productId) {
//       ...RecommendedProduct
//     }
//   }
//   ${RECOMMENDED_PRODUCT_FRAGMENT}
// `;

// export const meta = () => {
//   return [{ title: `Hydrogen | Cart` }];
// };

// export const headers = ({ actionHeaders }) => actionHeaders;

// export async function action({ request, context }) {
//   const { cart } = context;

//   const formData = await request.formData();
//   const { action, inputs } = CartForm.getFormInput(formData);

//   if (!action) {
//     throw new Error('No action provided');
//   }

//   let status = 200;
//   let result;

//   switch (action) {
//     case CartForm.ACTIONS.LinesAdd:
//       result = await cart.addLines(inputs.lines);
//       break;
//     case CartForm.ACTIONS.LinesUpdate:
//       result = await cart.updateLines(inputs.lines);
//       break;
//     case CartForm.ACTIONS.LinesRemove:
//       result = await cart.removeLines(inputs.lineIds);
//       break;
//     case CartForm.ACTIONS.DiscountCodesUpdate: {
//       const formDiscountCode = inputs.discountCode;
//       const discountCodes = formDiscountCode ? [formDiscountCode] : [];
//       discountCodes.push(...inputs.discountCodes);
//       result = await cart.updateDiscountCodes(discountCodes);
//       break;
//     }
//     case CartForm.ACTIONS.GiftCardCodesUpdate: {
//       const formGiftCardCode = inputs.giftCardCode;
//       const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];
//       giftCardCodes.push(...inputs.giftCardCodes);
//       result = await cart.updateGiftCardCodes(giftCardCodes);
//       break;
//     }
//     case CartForm.ACTIONS.GiftCardCodesRemove: {
//       const appliedGiftCardIds = inputs.giftCardCodes;
//       result = await cart.removeGiftCardCodes(appliedGiftCardIds);
//       break;
//     }
//     case CartForm.ACTIONS.BuyerIdentityUpdate: {
//       result = await cart.updateBuyerIdentity({
//         ...inputs.buyerIdentity,
//       });
//       break;
//     }
//     default:
//       throw new Error(`${action} cart action is not defined`);
//   }

//   const cartId = result?.cart?.id;
//   const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
//   const { cart: cartResult, errors, warnings } = result;

//   const redirectTo = formData.get('redirectTo') ?? null;
//   if (typeof redirectTo === 'string') {
//     status = 303;
//     headers.set('Location', redirectTo);
//   }

//   return data(
//     {
//       cart: cartResult,
//       errors,
//       warnings,
//       analytics: {
//         cartId,
//       },
//     },
//     { status, headers },
//   );
// }

// export async function loader({ context, request }) {
//   const { cart, storefront, sanityClient } = context;
   
//   const cartData = await cart.get({
//     country: storefront.i18n.country,
//     language: storefront.i18n.language,
//   });

//   const [freeShippingSettings, recommendationsSettings, cartSettings, recentlyViewedData, wishlistSettings] = await Promise.all([
//     sanityClient.fetch(FREE_SHIPPING_SETTINGS_QUERY).catch(error => {
//       console.error('Error fetching free shipping settings:', error);
//       return null;
//     }),
//     sanityClient.fetch(RECOMMENDATIONS_SETTINGS_QUERY).catch(error => {
//       console.error('Error fetching recommendations settings:', error);
//       return { enabled: false };
//     }),
//     sanityClient.fetch(CART_SETTINGS_QUERY).catch(error => {
//       console.error('Error fetching cart content settings:', error);
//       return { enabled: false };
//     }),
//     sanityClient.fetch(RECENTLY_SETTINGS_QUERY).catch(error => {
//       console.error('Error fetching recently viewed settings:', error);
//       return { enabled: false };
//     }),
//     sanityClient.fetch(WISHLIST_SETTINGS_QUERY).catch(error => {
//       console.error('Error fetching wishlist settings:', error);
//       return null;
//     }),
//   ]);

//   let recommendations = [];
//   if (cartData?.lines?.nodes?.length > 0 && recommendationsSettings?.enabled) {
//     const firstProductId = cartData.lines.nodes[0]?.merchandise?.product?.id;

//     if (firstProductId) {
//       try {
//         const { productRecommendations } = await storefront.query(RECOMMENDATIONS_QUERY, {
//           variables: {
//             productId: firstProductId,
//             country: storefront.i18n.country,
//             language: storefront.i18n.language,
//           },
//         });

//         recommendations = productRecommendations || [];
//       } catch (error) {
//         console.error('Error fetching recommendations from Storefront:', error);
//       }
//     }
//   }

//   const safeSettings = wishlistSettings || {
//     enabled: false,
//     requireLogin: true,
//     heartIconColor: 'red-500',
//     buttonPosition: 'top-right',
//     maxItems: 0,
//     showCount: true,
//     showNotification: true
//   };

//   let wishlist = [];
//   const cookie = request.headers.get('cookie') || '';
//   const match = cookie.match(/customerAccessToken=([^;]+)/);
//   const accessToken = match?.[1];
//   const isLoggedIn = !!accessToken;

//   if (safeSettings.enabled && isLoggedIn && accessToken) {
//     try {
//       const customerRes = await storefront.query(
//         `
//         query getCustomer($customerAccessToken: String!) {
//           customer(customerAccessToken: $customerAccessToken) {
//             id
//           }
//         }
//         `,
//         {
//           variables: {
//             customerAccessToken: accessToken,
//           },
//         }
//       );

//       const customerId = customerRes?.customer?.id;

//       if (customerId && context.env?.PRIVATE_ADMIN_TOKEN && context.env?.PUBLIC_STORE_DOMAIN) {
//         const adminQuery = `
//           query getCustomerWishlist($id: ID!) {
//             customer(id: $id) {
//               id
//               wishlist: metafield(namespace: "custom", key: "wishlist") {
//                 id
//                 namespace
//                 key
//                 value
//                 type
//               }
//             }
//           }
//         `;

//         const adminRes = await fetch(
//           `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'X-Shopify-Access-Token': context.env.PRIVATE_ADMIN_TOKEN,
//             },
//             body: JSON.stringify({
//               query: adminQuery,
//               variables: { id: customerId },
//             }),
//           }
//         );

//         if (adminRes.ok) {
//           const adminData = await adminRes.json();
//           const metafield = adminData?.data?.customer?.wishlist;

//           if (metafield?.value) {
//             try {
//               const parsed = JSON.parse(metafield.value);
//               wishlist = parsed.products || [];
//             } catch (e) {
//               console.error('Error parsing wishlist:', e);
//               wishlist = [];
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching wishlist:', error);
//     }
//   }

//   return {
//     cart: cartData,
//     freeShippingSettings,
//     recommendationsSettings,
//     recentlyViewedData,
//     cartSettings,
//     recommendations,
//     wishlist,
//     isLoggedIn,
//     isWishlistEnabled: safeSettings.enabled,
//     locale: storefront.i18n.country?.toLowerCase() || 'us'
//   };
// }

// export default function Cart() {
//   const globalData = useGlobalData();
  
//   const {
//     cart,
//     freeShippingSettings,
//     recommendationsSettings,
//     recentlyViewedData,
//     recommendations,
//     cartSettings,
//     wishlist,
//     isLoggedIn,
//     isWishlistEnabled,
//     locale
//   } = useLoaderData();

//   const [localWishlist, setLocalWishlist] = useState(wishlist || []);
  
//   const countryCode = cart?.buyerIdentity?.countryCode || 'US';

//   const fetcher = useFetcher();
//   const fetchers = useFetchers();
//   const { locale: paramLocale } = useParams();
  
//   const logoSection = {
//     ...cartSettings?.logoSlider,
//     logos: cartSettings?.logoSlider?.logos?.map((logo) => ({
//       imageUrl: logo?.image?.asset?.url,
//       link: logo?.link
//     }))
//   };
  
//   const currentCountry = paramLocale ? paramLocale.toUpperCase() : 'US';
//   const cartCountry = cart?.buyerIdentity?.countryCode;

//   const isAnyFetcherActive = fetchers.some((f) =>
//     f.data?.cart || f.formData?.get('cartFormInput')
//   );

//   useEffect(() => {
//     if (
//       cartCountry &&
//       cartCountry !== currentCountry &&
//       currentCountry.length === 2 &&
//       !isAnyFetcherActive &&
//       fetcher.state === 'idle'
//     ) {
//       const cartRoute = locale && locale.length === 2 ? `/${locale}/cart` : '/cart';

//       fetcher.submit(
//         {
//           cartFormInput: JSON.stringify({
//             action: CartForm.ACTIONS.BuyerIdentityUpdate,
//             inputs: { buyerIdentity: { countryCode: currentCountry } },
//           }),
//         },
//         { method: 'POST', action: cartRoute }
//       );
//     }
//   }, [cartCountry, currentCountry, isAnyFetcherActive, fetcher.state, locale]);
  
//   const activeCurrency = cart?.cost?.subtotalAmount?.currencyCode || 'USD';

//   const handleWishlistUpdate = (newWishlist) => {
//     setLocalWishlist(newWishlist);
//   };

//   const formattedRecommendations = recommendations.map(product => ({
//     ...product,
//     featuredImage: product.featuredImage || product.images?.nodes?.[0] || null,
//     images: product.images || { nodes: [] },
//     compareAtPriceRange: product.compareAtPriceRange || {
//       minVariantPrice: product.variants?.nodes?.[0]?.compareAtPrice || null
//     },
//   }));

//   // Dynamic style helpers using global data
//   const formatColor = (color) => {
//     if (!color) return null;
//     return color.startsWith('#') ? color : `#${color}`;
//   };

//   const getLinkStyle = () => {
//     if (!globalData?.linksEffect) return {};
//     const links = globalData.linksEffect;
//     return {
//       color: formatColor(links.linkColor),
//       transition: `color ${links.transitionDuration}ms ease`,
//       textDecoration: links.underlineStyle === 'none' ? 'none' : 'underline',
//     };
//   };

//   const getHoverStyle = () => {
//     if (!globalData?.linksEffect) return {};
//     return {
//       color: formatColor(globalData.linksEffect.hoverColor),
//     };
//   };

//   return (
//     <div 
//       className="cart w-full flex flex-col"
//      
//     >
//       <div className="mb-5">
//         <CartMain 
//           layout="page" 
//           cart={cart} 
//           freeShippingSettings={freeShippingSettings} 
//           cartSettings={cartSettings}
//           isWishlistEnabled={isWishlistEnabled}
//           isLoggedIn={isLoggedIn}
//           wishlist={localWishlist}
//           onWishlistUpdate={handleWishlistUpdate}
//           globalData={globalData}
//         />
//       </div>

//       {cartSettings?.enablefeatureHighlightsSection && cartSettings?.featureHighlights && (
//         <FeatureHighlights 
//           data={cartSettings} 
//           globalData={globalData}
//         />
//       )}

//       {recommendationsSettings?.enabled && formattedRecommendations?.length > 0 && (
//         <div className="">
//           <Recommendations
//             products={formattedRecommendations}
//             settings={recommendationsSettings}
//             isLoggedIn={isLoggedIn}
//             isWishlistEnabled={isWishlistEnabled}
//             wishlist={localWishlist}
//             onWishlistUpdate={handleWishlistUpdate}
//             locale={locale}
//             globalData={globalData}
//           />
//         </div>
//       )}

//       {recentlyViewedData?.enabled && (
//         <div className="">
//           <RecentlyViewedSection
//             settings={recentlyViewedData}
//             isLoggedIn={isLoggedIn}
//             isWishlistEnabled={isWishlistEnabled}
//             wishlist={localWishlist}
//             onWishlistUpdate={handleWishlistUpdate}
//             locale={locale}
//             globalData={globalData}
//           />
//         </div>
//       )}

//       {cartSettings?.enableLogoSlider && (
//         <div className="mt-16">
//           <LogoSlider data={logoSection} globalData={globalData} />
//         </div>
//       )}
//     </div>
//   );
// }

// /** @typedef {import('react-router').HeadersFunction} HeadersFunction */
// /** @typedef {import('./+types/cart').Route} Route */
// /** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
// /** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
// /** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
import { CartMain } from '~/components/CartMain';
import { FreeShippingBar } from '~/components/FreeShippingBar';
import { FREE_SHIPPING_SETTINGS_QUERY } from '~/sanity/queries/freeShipping';
import { useLoaderData, useFetcher, useFetchers, useParams, data, Link,useRouteLoaderData } from 'react-router';
import { useEffect, useState } from 'react';
import { CartForm } from '@shopify/hydrogen';
import { RECOMMENDATIONS_SETTINGS_QUERY } from '~/sanity/queries/recommendations';
import { RECENTLY_SETTINGS_QUERY } from '~/sanity/queries/recentlyViewed';
import { Recommendations } from '~/components/Recommendations';
import { RecentlyViewedSection } from '~/components/RecentlyViewed';
import { CART_SETTINGS_QUERY } from '~/sanity/queries/cartpage';
import LogoSlider from '~/components/LogoSlider';
import FeatureHighlights from '~/components/FeatureHighlights';
import { WISHLIST_SETTINGS_QUERY } from '~/sanity/queries/wishlist';

/**
 * Helper to get global data from root
 */
export function useGlobalData() {
  const rootData = useRouteLoaderData('root');
  return rootData?.globalSettings || null;
}

const RECOMMENDED_PRODUCT_FRAGMENT = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    vendor
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
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
    images(first: 5) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 5) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
    productType
    tags
  }
`;

const RECOMMENDATIONS_QUERY = `#graphql
  query getProductRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...RecommendedProduct
    }
  }
  ${RECOMMENDED_PRODUCT_FRAGMENT}
`;

// FALLBACK BESTSELLERS QUERY
const BESTSELLERS_QUERY = `#graphql
  query getBestsellers($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
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
        images(first: 5) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
        variants(first: 5) {
          nodes {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
        productType
        tags
      }
    }
  }
`;

export const meta = () => {
  return [{ title: `Hydrogen | Cart` }];
};

export const headers = ({ actionHeaders }) => actionHeaders;

export async function action({ request, context }) {
  const { cart } = context;

  const formData = await request.formData();
  const { action, inputs } = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];
      giftCardCodes.push(...inputs.giftCardCodes);
      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes;
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const { cart: cartResult, errors, warnings } = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    { status, headers },
  );
}

export async function loader({ context, request }) {
  const { cart, storefront, sanityClient } = context;
   
  const cartData = await cart.get({
    country: storefront.i18n.country,
    language: storefront.i18n.language,
  });

  const [freeShippingSettings, recommendationsSettings, cartSettings, recentlyViewedData, wishlistSettings] = await Promise.all([
    sanityClient.fetch(FREE_SHIPPING_SETTINGS_QUERY).catch(error => {
      console.error('Error fetching free shipping settings:', error);
      return null;
    }),
    sanityClient.fetch(RECOMMENDATIONS_SETTINGS_QUERY).catch(error => {
      console.error('Error fetching recommendations settings:', error);
      return { enabled: false };
    }),
    sanityClient.fetch(CART_SETTINGS_QUERY).catch(error => {
      console.error('Error fetching cart content settings:', error);
      return { enabled: false };
    }),
    sanityClient.fetch(RECENTLY_SETTINGS_QUERY).catch(error => {
      console.error('Error fetching recently viewed settings:', error);
      return { enabled: false };
    }),
    sanityClient.fetch(WISHLIST_SETTINGS_QUERY).catch(error => {
      console.error('Error fetching wishlist settings:', error);
      return null;
    }),
  ]);

  let recommendations = [];
  let bestsellers = [];
  
  // Check if we need fallback for recommendations
  const shouldUseBestsellersFallback = !recommendationsSettings?.enabled || 
                                        !cartData?.lines?.nodes?.length > 0;
  
  if (shouldUseBestsellersFallback) {
    // Fetch bestsellers as fallback
    try {
      const bestsellersData = await storefront.query(BESTSELLERS_QUERY, {
        variables: {
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
      });
      bestsellers = bestsellersData?.products?.nodes || [];
    } catch (error) {
      console.error('Error fetching bestsellers fallback:', error);
      bestsellers = [];
    }
  } else {
    // Normal recommendations flow
    if (cartData?.lines?.nodes?.length > 0 && recommendationsSettings?.enabled) {
      const firstProductId = cartData.lines.nodes[0]?.merchandise?.product?.id;

      if (firstProductId) {
        try {
          const { productRecommendations } = await storefront.query(RECOMMENDATIONS_QUERY, {
            variables: {
              productId: firstProductId,
              country: storefront.i18n.country,
              language: storefront.i18n.language,
            },
          });
          recommendations = productRecommendations || [];
        } catch (error) {
          console.error('Error fetching recommendations from Storefront:', error);
        }
      }
    }
  }

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
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];
  const isLoggedIn = !!accessToken;

  if (safeSettings.enabled && isLoggedIn && accessToken) {
    try {
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

      if (customerId && context.env?.PRIVATE_ADMIN_TOKEN && context.env?.PUBLIC_STORE_DOMAIN) {
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

        if (adminRes.ok) {
          const adminData = await adminRes.json();
          const metafield = adminData?.data?.customer?.wishlist;

          if (metafield?.value) {
            try {
              const parsed = JSON.parse(metafield.value);
              wishlist = parsed.products || [];
            } catch (e) {
              console.error('Error parsing wishlist:', e);
              wishlist = [];
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }

  return {
    cart: cartData,
    freeShippingSettings,
    recommendationsSettings,
    recentlyViewedData,
    cartSettings,
    recommendations,
    bestsellers,
    wishlist,
    isLoggedIn,
    isWishlistEnabled: safeSettings.enabled,
    locale: storefront.i18n.country?.toLowerCase() || 'us',
    shouldUseBestsellersFallback
  };
}

// Fallback Bestsellers Component
function BestsellersSection({ products, globalData, isLoggedIn, isWishlistEnabled, wishlist, onWishlistUpdate, locale }) {
  if (!products || products.length === 0) return null;

  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  return (
    
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 
          className="text-2xl font-bold text-center mb-8"
          style={{ 
            fontFamily: globalData?.fontFamily || 'Montserrat, sans-serif',
            color: formatColor(globalData?.headingColor)
          }}
        >
          Best Sellers
        </h2>
         
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <Link to={`/products/${product.handle}`} className="block h-full">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                
                {product.featuredImage && (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.vendor}</p>
                <div className="mt-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.priceRange.minVariantPrice.currencyCode
                    }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                  </span>
                </div>
              </div>
              </Link>
            </div>
           
          ))}
        </div>
  
      </div>
    </div>
  
  );
}

export default function Cart() {
  const globalData = useGlobalData();
  
  const {
    cart,
    freeShippingSettings,
    recommendationsSettings,
    recentlyViewedData,
    recommendations,
    bestsellers,
    cartSettings,
    wishlist,
    isLoggedIn,
    isWishlistEnabled,
    locale,
    shouldUseBestsellersFallback
  } = useLoaderData();

  const [localWishlist, setLocalWishlist] = useState(wishlist || []);
  
  const countryCode = cart?.buyerIdentity?.countryCode || 'US';

  const fetcher = useFetcher();
  const fetchers = useFetchers();
  const { locale: paramLocale } = useParams();
  
  // Logo slider fallback data
  const hasValidLogos = cartSettings?.enableLogoSlider && 
                        cartSettings?.logoSlider?.logos && 
                        cartSettings?.logoSlider?.logos.length > 0;
  
  const logoSection = hasValidLogos ? {
    ...cartSettings?.logoSlider,
    logos: cartSettings?.logoSlider?.logos?.map((logo) => ({
      imageUrl: logo?.image?.asset?.url,
      link: logo?.link
    }))
  } : {
    enabled: true,
    logos: [] // Empty logos will make LogoSlider handle its own fallback
  };
  
  const currentCountry = paramLocale ? paramLocale.toUpperCase() : 'US';
  const cartCountry = cart?.buyerIdentity?.countryCode;

  const isAnyFetcherActive = fetchers.some((f) =>
    f.data?.cart || f.formData?.get('cartFormInput')
  );

  useEffect(() => {
    if (
      cartCountry &&
      cartCountry !== currentCountry &&
      currentCountry.length === 2 &&
      !isAnyFetcherActive &&
      fetcher.state === 'idle'
    ) {
      const cartRoute = locale && locale.length === 2 ? `/${locale}/cart` : '/cart';

      fetcher.submit(
        {
          cartFormInput: JSON.stringify({
            action: CartForm.ACTIONS.BuyerIdentityUpdate,
            inputs: { buyerIdentity: { countryCode: currentCountry } },
          }),
        },
        { method: 'POST', action: cartRoute }
      );
    }
  }, [cartCountry, currentCountry, isAnyFetcherActive, fetcher.state, locale]);
  
  const activeCurrency = cart?.cost?.subtotalAmount?.currencyCode || 'USD';

  const handleWishlistUpdate = (newWishlist) => {
    setLocalWishlist(newWishlist);
  };

  const formattedRecommendations = recommendations.map(product => ({
    ...product,
    featuredImage: product.featuredImage || product.images?.nodes?.[0] || null,
    images: product.images || { nodes: [] },
    compareAtPriceRange: product.compareAtPriceRange || {
      minVariantPrice: product.variants?.nodes?.[0]?.compareAtPrice || null
    },
  }));

  // Dynamic style helpers using global data
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const getLinkStyle = () => {
    if (!globalData?.linksEffect) return {};
    const links = globalData.linksEffect;
    return {
      color: formatColor(links.linkColor),
      transition: `color ${links.transitionDuration}ms ease`,
      textDecoration: links.underlineStyle === 'none' ? 'none' : 'underline',
    };
  };

  const getHoverStyle = () => {
    if (!globalData?.linksEffect) return {};
    return {
      color: formatColor(globalData.linksEffect.hoverColor),
    };
  };

  // Check if FeatureHighlights should use fallback
  const hasValidFeatureHighlights = cartSettings?.enablefeatureHighlightsSection && 
                                     cartSettings?.featureHighlights?.features?.length > 0;

  // Check if RecentlyViewed should use fallback
  const hasValidRecentlyViewed = recentlyViewedData?.enabled && 
                                  recentlyViewedData?.settings?.enabled !== false;

  return (
    <div 
      className="cart w-full flex flex-col"
    
    >
      <div className="mb-5">
        <CartMain 
          layout="page" 
          cart={cart} 
          freeShippingSettings={freeShippingSettings} 
          cartSettings={cartSettings}
          isWishlistEnabled={isWishlistEnabled}
          isLoggedIn={isLoggedIn}
          wishlist={localWishlist}
          onWishlistUpdate={handleWishlistUpdate}
          globalData={globalData}
        />
      </div>

      {/* FeatureHighlights with fallback handling - always show if cartSettings exists OR use fallback internally */}
      <FeatureHighlights 
        data={cartSettings || {}} 
        globalData={globalData}
      />

      {/* Recommendations OR Bestsellers Fallback */}
      {shouldUseBestsellersFallback ? (
        // Show Bestsellers as fallback
        bestsellers && bestsellers.length > 0 && (
          <BestsellersSection 
            products={bestsellers}
            globalData={globalData}
            isLoggedIn={isLoggedIn}
            isWishlistEnabled={isWishlistEnabled}
            wishlist={localWishlist}
            onWishlistUpdate={handleWishlistUpdate}
            locale={locale}
          />
        )
      ) : (
        // Show normal Recommendations
        recommendationsSettings?.enabled && formattedRecommendations?.length > 0 && (
          <div className="">
            <Recommendations
              products={formattedRecommendations}
              settings={recommendationsSettings}
              isLoggedIn={isLoggedIn}
              isWishlistEnabled={isWishlistEnabled}
              wishlist={localWishlist}
              onWishlistUpdate={handleWishlistUpdate}
              locale={locale}
              globalData={globalData}
            />
          </div>
        )
      )}

      {/* Recently Viewed Section - only show if enabled and has valid data */}
      {hasValidRecentlyViewed && (
        <div className="">
          <RecentlyViewedSection
            settings={recentlyViewedData}
            isLoggedIn={isLoggedIn}
            isWishlistEnabled={isWishlistEnabled}
            wishlist={localWishlist}
            onWishlistUpdate={handleWishlistUpdate}
            locale={locale}
            globalData={globalData}
          />
        </div>
      )}

      {/* Logo Slider - always show with internal fallback */}
      <div className="mt-16">
        <LogoSlider 
          data={logoSection} 
          globalData={globalData}
        />
      </div>
    </div>
  );
}

/** @typedef {import('react-router').HeadersFunction} HeadersFunction */
/** @typedef {import('./+types/cart').Route} Route */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */