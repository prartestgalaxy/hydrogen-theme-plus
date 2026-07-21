
// import { RECOMMENDATIONS_SETTINGS_QUERY } from '~/sanity/queries/recommendations';

// export async function loader({ context, request }) {
//   const url = new URL(request.url);
//   const productId = url.searchParams.get("productId");

//   // 1. Get the locale from the URL path (e.g., /nl/api/recommendations)
//   const pathSegments = url.pathname.split('/');
//   // If the first segment is 2 characters, assume it's a country code
//   const urlLocale = pathSegments[1]?.length === 2 ? pathSegments[1].toUpperCase() : null;

//   // 2. Fallback to a query param (e.g., ?country=FR) if not in the path
//   const paramCountry = url.searchParams.get("country")?.toUpperCase();

//   // 3. Final Fallback to the default store context
//   const country = urlLocale || paramCountry || context.storefront.i18n.country || 'US';
//   const language = context.storefront.i18n.language || 'EN';

//   const i18n = { country, language };



//   // Get Sanity settings first
//   const settings = await context.sanityClient.fetch(RECOMMENDATIONS_SETTINGS_QUERY);

//   // If recommendations are disabled in Sanity, return empty
//   if (!settings?.enabled) {

//     return new Response(JSON.stringify({
//       products: [],
//       settings: null
//     }), { headers: { "Content-Type": "application/json" } });
//   }



//   // 1️⃣ Get customer token
//   const cookie = request.headers.get("cookie") || "";
//   const match = cookie.match(/customerAccessToken=([^;]+)/);
//   const accessToken = match?.[1];



//   let products = [];
//   let source = "fallback";

//   // Apply algorithm based on Sanity settings
//   try {
//     switch (settings.algorithm) {
//       case 'lastViewedCategory':
//         products = await getLastViewedCategoryRecommendations(context, accessToken, productId, settings, i18n);
//         source = "last_viewed_category";
//         break;

//       case 'wishlistContains':
//         products = await getWishlistBasedRecommendations(context, accessToken, productId, settings, i18n);
//         source = "wishlist_based";
//         break;

//       case 'cartContains':
//         products = await getCartBasedRecommendations(context, accessToken, productId, settings, request, i18n);
//         source = "cart_based";
//         break;

//       default:
//         products = await getFallbackRecommendations(context, productId, settings, i18n);
//     }
//   } catch (error) {
//     console.error("Error in recommendation algorithm:", error);
//     products = [];
//   }

//   // If no products found and fallback collection is set, use it
//   if (products.length === 0 && settings.fallbackCollectionHandle) {

//     products = await getProductsFromCollection(context, settings.fallbackCollectionHandle, settings.productsLimit, i18n);
//     source = "fallback_collection";
//   }

//   // If still no products, try Shopify's built-in recommendations
//   if (products.length === 0) {

//     products = await getFallbackRecommendations(context, productId, settings, i18n);
//     source = "shopify_fallback";
//   }

//   // Apply the limit from Sanity settings
//   const limitedProducts = products.slice(0, settings.productsLimit || 8);



//   return new Response(JSON.stringify({
//     source,
//     products: limitedProducts,
//     settings: {
//       title: settings.sectionTitle,
//       algorithm: settings.algorithm
//     }
//   }), { headers: { "Content-Type": "application/json" } });
// }



// async function getLastViewedCategoryRecommendations(context, accessToken, currentProductId, settings, i18n) {
//   if (!accessToken) {
//     return [];
//   }

//   try {
//     // Change from "viewed_products" to "browsing_history" to match your existing metafield
//     const metafieldRes = await context.storefront.query(`
//       query getViewed($token: String!) {
//         customer(customerAccessToken: $token) {
//           metafield(namespace: "custom", key: "browsing_history") {
//             value
//           }
//         }
//       }
//     `, {
//       variables: { token: accessToken }
//     });

//     let lastCategory = null;
//     let viewedProducts = [];

//     if (metafieldRes?.customer?.metafield?.value) {
//       const parsed = JSON.parse(metafieldRes.customer.metafield.value);
//       // Your browsing_history structure might be different
//       // Based on your track-view API, it stores: { viewed: [], lastCategory: null }
//       viewedProducts = parsed.viewed || [];
//       lastCategory = parsed.lastCategory;


//     }

//     if (lastCategory) {
//       const products = await getProductsByCategory(
//         context,
//         lastCategory,
//         currentProductId,
//         settings.productsLimit,
//         i18n
//       );

//       if (products.length > 0) {
//         return products;
//       }
//     }

//     // If viewed products are just IDs (not objects with category), 
//     // we need to fetch the product details to get categories
//     if (viewedProducts.length > 0) {
//       // Get the most recent viewed product ID
//       const mostRecentProductId = viewedProducts[0];

//       if (mostRecentProductId) {
//         // Fetch that product to get its category
//         const productRes = await context.storefront.query(`
//           query getProduct($id: ID!) {
//             product(id: $id) {
//               id
//               productType
//             }
//           }
//         `, {
//           variables: { id: mostRecentProductId }
//         });

//         const category = productRes?.product?.productType;

//         if (category) {
//           const products = await getProductsByCategory(
//             context,
//             category,
//             currentProductId,
//             settings.productsLimit,
//             i18n
//           );

//           if (products.length > 0) {
//             return products;
//           }
//         }
//       }
//     }

//     return [];
//   } catch (error) {
//     console.error("Error in last viewed category:", error);
//     return [];
//   }
// }

// // 📌 WISHLIST BASED ALGORITHM
// async function getWishlistBasedRecommendations(context, request, accessToken, currentProductId, settings, i18n) {
//   if (!accessToken) return [];

//   try {
//     const customerRes = await context.storefront.query(`
//       query getCustomer($token: String!) {
//         customer(customerAccessToken: $token) {
//           id
//         }
//       }
//     `, {
//       variables: { token: accessToken }
//     });

//     const customerId = customerRes?.customer?.id;
//     if (!customerId) return [];

//     const adminRes = await fetch(
//       `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
//       {
//         method: 'POST',
//         signal: request.signal,
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Shopify-Access-Token': context.env.PRIVATE_ADMIN_TOKEN,
//         },
//         body: JSON.stringify({
//           query: `
//             query getCustomerWishlist($id: ID!) {
//               customer(id: $id) {
//                 metafield(namespace: "custom", key: "wishlist") {
//                   value
//                 }
//               }
//             }
//           `,
//           variables: { id: customerId },
//         }),
//       }
//     );

//     const adminData = await adminRes.json();
//     const metafieldValue = adminData?.data?.customer?.metafield?.value;

//     if (!metafieldValue) return [];

//     const wishlistData = JSON.parse(metafieldValue);
//     const wishlistProducts = wishlistData.products || [];

//     if (wishlistProducts.length === 0) return [];



//     const categories = [...new Set(wishlistProducts.map(p => p.productType).filter(Boolean))];

//     if (categories.length > 0) {
//       return await getProductsByCategory(
//         context,
//         categories[0],
//         currentProductId,
//         settings.productsLimit,
//         i18n
//       );
//     }

//     return [];
//   } catch (error) {
//     console.error("Error in wishlist based recommendations:", error);
//     return [];
//   }
// }

// async function getCartBasedRecommendations(context, accessToken, currentProductId, settings, request, i18n) {


//   if (!accessToken) {

//     return [];
//   }

//   try {
//     // 1️⃣ Get customer ID from Storefront API
//     const customerRes = await context.storefront.query(`
//       query getCustomer($token: String!) {
//         customer(customerAccessToken: $token) {
//           id
//           email
//           firstName
//           lastName
//         }
//       }
//     `, {
//       variables: { token: accessToken }
//     });

//     const customer = customerRes?.customer;
//     if (!customer?.id) {

//       return [];
//     }


//     // 2️⃣ Get cart token from cookie
//     const cookie = request.headers.get("cookie") || "";


//     // Look for the cart token in cookies - common patterns
//     const cartPatterns = [
//       /cart=([^;]+)/,
//       /cartId=([^;]+)/,
//       /shopify_cart_id=([^;]+)/,
//       /cart_token=([^;]+)/,
//       /cart_currency=([^;]+)/  // Sometimes the token is in cart_currency cookie
//     ];

//     let cartToken = null;
//     for (const pattern of cartPatterns) {
//       const match = cookie.match(pattern);
//       if (match?.[1]) {
//         cartToken = match[1];

//         break;
//       }
//     }

//     if (!cartToken) {


//       // Try to get from the request URL or headers
//       const url = new URL(request.url);
//       const cartParam = url.searchParams.get("cart");
//       if (cartParam) {
//         cartToken = cartParam;

//       }
//     }

//     if (!cartToken) {

//       return [];
//     }

//     // 3️⃣ Clean the cart token - remove URL encoding if present
//     cartToken = decodeURIComponent(cartToken);


//     // 4️⃣ Query the cart using the Storefront API with the cart token
//     // Note: For Storefront API, you need to use the cart ID in the format: gid://shopify/Cart/{token}
//     const cartGid = `gid://shopify/Cart/${cartToken}`;


//     const cartRes = await context.storefront.query(`
//       query getCartContents($cartId: ID!) {
//         cart(id: $cartId) {
//           id
//           lines(first: 20) {
//             edges {
//               node {
//                 id
//                 quantity
//                 merchandise {
//                   ... on ProductVariant {
//                     id
//                     product {
//                       id
//                       title
//                       productType
//                       vendor
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     `, {
//       variables: {
//         cartId: cartGid
//       }
//     });



//     const cart = cartRes?.cart;

//     if (!cart) {


//       // Alternative approach: Try to get cart via checkout API (legacy)
//       // Some stores use checkout tokens instead

//       // You might need to use the checkout API instead
//       const checkoutRes = await context.storefront.query(`
//         query getCheckout($checkoutId: ID!) {
//           node(id: $checkoutId) {
//             ... on Checkout {
//               id
//               lineItems(first: 20) {
//                 edges {
//                   node {
//                     title
//                     quantity
//                     variant {
//                       product {
//                         id
//                         productType
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `, {
//         variables: {
//           checkoutId: `gid://shopify/Checkout/${cartToken}`
//         }
//       });



//       const checkout = checkoutRes?.data?.node;
//       if (checkout) {


//         // Extract categories from checkout
//         const categories = checkout.lineItems?.edges
//           .map(edge => edge.node.variant?.product?.productType)
//           .filter(Boolean);

//         if (categories?.length > 0) {
//           return await getProductsByCategory(
//             context,
//             categories[0],
//             currentProductId,
//             settings.productsLimit || 8,
//             i18n
//           );
//         }
//       }

//       return [];
//     }

//     if (!cart.lines?.edges?.length) {

//       return [];
//     }



//     // Extract categories from cart items
//     const categories = cart.lines.edges
//       .map(edge => edge.node.merchandise?.product?.productType)
//       .filter(Boolean);



//     if (categories.length > 0) {
//       // Get products from the first category (most frequent category might be better)
//       const products = await getProductsByCategory(
//         context,
//         categories[0],
//         currentProductId,
//         settings.productsLimit || 8,
//         i18n
//       );

//       if (products.length > 0) {
//         return products;
//       }
//     }

//     return [];

//   } catch (error) {
//     console.error("❌ Error in cart-based recommendations:", error);
//     return [];
//   }
// }
// // 📌 HELPER: Get products by category
// // Change the function signature to receive the i18n object
// async function getProductsByCategory(context, category, excludeProductId, limit, i18n) {
//   if (!category) return [];

//   try {
//     const res = await context.storefront.query(`
//       query byType($query: String!) {
//         products(first: ${limit + 5}, query: $query) {
//           nodes {
//             id
//             title
//             handle
//             vendor
//             featuredImage { 
//               url 
//               altText
//               width
//               height
//             }
//             priceRange {
//               minVariantPrice { amount currencyCode }
//               maxVariantPrice { amount currencyCode }
//             }
//             variants(first: 1) {
//               nodes { id availableForSale }
//             }
//           }
//         }
//       }
//     `, {
//       variables: { query: `product_type:'${category}'` }
//     });

//     return (res?.products?.nodes || [])
//       .filter(p => p.id !== excludeProductId)
//       .slice(0, limit);
//   } catch (error) {
//     console.error("Error getting products by category:", error);
//     return [];
//   }
// }
// // // 📌 HELPER: Get products from collection


// // ✅ 1. Added i18n to the function arguments
// async function getProductsFromCollection(context, collectionHandle, limit, i18n) {
//   try {
//     const res = await context.storefront.query(`
//       # ✅ 2. Fixed the GraphQL syntax so the variables and @inContext are in the right place!
//       query getCollection($handle: String!, $first: Int!, $country: CountryCode, $language: LanguageCode) 
//       @inContext(country: $country, language: $language) {
//         collection(handle: $handle) {
//           products(first: $first) {
//             nodes {
//               id
//               title
//               handle
//               productType
//               vendor
//               featuredImage { 
//                 url 
//                 altText
//                 width
//                 height
//               }
//               priceRange {
//                 minVariantPrice { 
//                   amount
//                   currencyCode
//                 }
//                 maxVariantPrice {
//                   amount
//                   currencyCode
//                 }
//               }
//             }
//           }
//         }
//       }
//     `, {
//       variables: {
//         handle: collectionHandle,
//         first: limit,
//         // ✅ 3. Safely pass the i18n variables
//         country: i18n?.country || 'US',
//         language: i18n?.language || 'EN'
//       }
//     });

//     const products = res?.collection?.products?.nodes || [];

//     return products;
//   } catch (error) {
//     console.error("Error getting products from collection:", error);
//     return [];
//   }
// }

// // 📌 FALLBACK: Shopify's product recommendations
// async function getFallbackRecommendations(context, productId, settings, i18n) {
//   if (!productId) return [];

//   try {

//     const res = await context.storefront.query(`
//       query recs($id: ID!) {
//         productRecommendations(productId: $id) {
//           id
//           title
//           handle
//           vendor
//           featuredImage { 
//             url 
//             altText
//             width
//             height
//           }
//           priceRange {
//             minVariantPrice { amount currencyCode }
//             maxVariantPrice { amount currencyCode }
//           }
//           variants(first: 1) {
//             nodes { id availableForSale }
//           }
//         }
//       }
//     `, {
//       variables: { id: productId }
//     });

//     return (res?.productRecommendations || []).slice(0, settings.productsLimit);
//   } catch (error) {
//     return [];
//   }
// }
import { RECOMMENDATIONS_SETTINGS_QUERY } from '~/sanity/queries/recommendations';

export async function loader({ context, request }) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  const variantId = url.searchParams.get("variantId");
  const variantOptions = url.searchParams.get("variantOptions");

  // Get the locale from the URL path
  const pathSegments = url.pathname.split('/');
  const urlLocale = pathSegments[1]?.length === 2 ? pathSegments[1].toUpperCase() : null;
  const paramCountry = url.searchParams.get("country")?.toUpperCase();
  const country = urlLocale || paramCountry || context.storefront.i18n.country || 'US';
  const language = context.storefront.i18n.language || 'EN';
  const i18n = { country, language };

  // Get Sanity settings
  const settings = await context.sanityClient.fetch(RECOMMENDATIONS_SETTINGS_QUERY);

  // If recommendations are disabled, return empty
  if (!settings?.enabled) {
    return new Response(JSON.stringify({
      products: [],
      settings: null
    }), { headers: { "Content-Type": "application/json" } });
  }

  // Get customer token
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];

  let products = [];
  let source = "fallback";

  // Apply algorithm based on Sanity settings
  try {
    switch (settings.algorithm) {
      case 'lastViewedCategory':
        products = await getLastViewedCategoryRecommendations(context, accessToken, productId, variantId, variantOptions, settings, i18n);
        source = "last_viewed_category";
        break;

      case 'wishlistContains':
        products = await getWishlistBasedRecommendations(context, accessToken, productId, variantId, variantOptions, settings, i18n);
        source = "wishlist_based";
        break;

      case 'cartContains':
        products = await getCartBasedRecommendations(context, accessToken, productId, variantId, variantOptions, settings, request, i18n);
        source = "cart_based";
        break;

      default:
        products = await getFallbackRecommendations(context, productId, settings, i18n);
    }
  } catch (error) {
    console.error("Error in recommendation algorithm:", error);
    products = [];
  }

  // If no products found and fallback collection is set, use it
  if (products.length === 0 && settings.fallbackCollectionHandle) {
    products = await getProductsFromCollection(context, settings.fallbackCollectionHandle, settings.productsLimit, i18n);
    source = "fallback_collection";
  }

  // If still no products, try Shopify's built-in recommendations
  if (products.length === 0) {
    products = await getFallbackRecommendations(context, productId, settings, i18n);
    source = "shopify_fallback";
  }

  // Apply the limit from Sanity settings
  const limitedProducts = products.slice(0, settings.productsLimit || 8);

  return new Response(JSON.stringify({
    source,
    products: limitedProducts,
    settings: {
      title: settings.sectionTitle,
      algorithm: settings.algorithm
    }
  }), { headers: { "Content-Type": "application/json" } });
}

async function getLastViewedCategoryRecommendations(context, accessToken, currentProductId, currentVariantId, variantOptions, settings, i18n) {
  if (!accessToken) {
    return [];
  }

  try {
    const metafieldRes = await context.storefront.query(`
      query getViewed($token: String!) {
        customer(customerAccessToken: $token) {
          metafield(namespace: "custom", key: "browsing_history") {
            value
          }
        }
      }
    `, {
      variables: { token: accessToken }
    });

    let lastCategory = null;
    let viewedProducts = [];

    if (metafieldRes?.customer?.metafield?.value) {
      const parsed = JSON.parse(metafieldRes.customer.metafield.value);
      viewedProducts = parsed.viewed || [];
      lastCategory = parsed.lastCategory;
    }

    if (lastCategory) {
      const products = await getProductsByCategory(
        context,
        lastCategory,
        currentProductId,
        settings.productsLimit,
        i18n
      );
      return products;
    }

    if (viewedProducts.length > 0) {
      const mostRecentProductId = viewedProducts[0];
      if (mostRecentProductId) {
        const productRes = await context.storefront.query(`
          query getProduct($id: ID!) {
            product(id: $id) {
              id
              productType
            }
          }
        `, {
          variables: { id: mostRecentProductId }
        });

        const category = productRes?.product?.productType;
        if (category) {
          const products = await getProductsByCategory(
            context,
            category,
            currentProductId,
            settings.productsLimit,
            i18n
          );
          return products;
        }
      }
    }

    return [];
  } catch (error) {
    console.error("Error in last viewed category:", error);
    return [];
  }
}

async function getWishlistBasedRecommendations(context, accessToken, currentProductId, currentVariantId, variantOptions, settings, i18n) {
  if (!accessToken) return [];

  try {
    const customerRes = await context.storefront.query(`
      query getCustomer($token: String!) {
        customer(customerAccessToken: $token) {
          id
        }
      }
    `, {
      variables: { token: accessToken }
    });

    const customerId = customerRes?.customer?.id;
    if (!customerId) return [];

    const adminRes = await fetch(
      `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': context.env.PRIVATE_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query getCustomerWishlist($id: ID!) {
              customer(id: $id) {
                metafield(namespace: "custom", key: "wishlist") {
                  value
                }
              }
            }
          `,
          variables: { id: customerId },
        }),
      }
    );

    const adminData = await adminRes.json();
    const metafieldValue = adminData?.data?.customer?.metafield?.value;

    if (!metafieldValue) return [];

    const wishlistData = JSON.parse(metafieldValue);
    const wishlistProducts = wishlistData.products || [];

    if (wishlistProducts.length === 0) return [];

    // Extract categories from wishlist items
    const categories = [...new Set(wishlistProducts.map(p => p.productType || p.vendor).filter(Boolean))];

    if (categories.length > 0) {
      const products = await getProductsByCategory(
        context,
        categories[0],
        currentProductId,
        settings.productsLimit,
        i18n
      );
      return products;
    }

    return [];
  } catch (error) {
    console.error("Error in wishlist based recommendations:", error);
    return [];
  }
}

async function getCartBasedRecommendations(context, accessToken, currentProductId, currentVariantId, variantOptions, settings, request, i18n) {
  if (!accessToken) {
    return [];
  }

  try {
    const customerRes = await context.storefront.query(`
      query getCustomer($token: String!) {
        customer(customerAccessToken: $token) {
          id
          email
          firstName
          lastName
        }
      }
    `, {
      variables: { token: accessToken }
    });

    const customer = customerRes?.customer;
    if (!customer?.id) {
      return [];
    }

    const cookie = request.headers.get("cookie") || "";
    const cartPatterns = [
      /cart=([^;]+)/,
      /cartId=([^;]+)/,
      /shopify_cart_id=([^;]+)/,
      /cart_token=([^;]+)/,
      /cart_currency=([^;]+)/
    ];

    let cartToken = null;
    for (const pattern of cartPatterns) {
      const match = cookie.match(pattern);
      if (match?.[1]) {
        cartToken = match[1];
        break;
      }
    }

    if (!cartToken) {
      const url = new URL(request.url);
      const cartParam = url.searchParams.get("cart");
      if (cartParam) {
        cartToken = cartParam;
      }
    }

    if (!cartToken) {
      return [];
    }

    cartToken = decodeURIComponent(cartToken);
    const cartGid = `gid://shopify/Cart/${cartToken}`;

    const cartRes = await context.storefront.query(`
      query getCartContents($cartId: ID!) {
        cart(id: $cartId) {
          id
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    product {
                      id
                      title
                      productType
                      vendor
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    `, {
      variables: {
        cartId: cartGid
      }
    });

    const cart = cartRes?.cart;

    if (!cart) {
      const checkoutRes = await context.storefront.query(`
        query getCheckout($checkoutId: ID!) {
          node(id: $checkoutId) {
            ... on Checkout {
              id
              lineItems(first: 20) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      product {
                        id
                        productType
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `, {
        variables: {
          checkoutId: `gid://shopify/Checkout/${cartToken}`
        }
      });

      const checkout = checkoutRes?.data?.node;
      if (checkout) {
        const categories = checkout.lineItems?.edges
          .map(edge => edge.node.variant?.product?.productType)
          .filter(Boolean);

        if (categories?.length > 0) {
          const products = await getProductsByCategory(
            context,
            categories[0],
            currentProductId,
            settings.productsLimit || 8,
            i18n
          );
          return products;
        }
      }
      return [];
    }

    if (!cart.lines?.edges?.length) {
      return [];
    }

    const categories = cart.lines.edges
      .map(edge => edge.node.merchandise?.product?.productType)
      .filter(Boolean);

    if (categories.length > 0) {
      const products = await getProductsByCategory(
        context,
        categories[0],
        currentProductId,
        settings.productsLimit || 8,
        i18n
      );
      return products;
    }

    return [];
  } catch (error) {
    console.error("❌ Error in cart-based recommendations:", error);
    return [];
  }
}

async function getProductsByCategory(context, category, excludeProductId, limit, i18n) {
  if (!category) return [];

  try {
    const res = await context.storefront.query(`
      query byType($query: String!, $country: CountryCode, $language: LanguageCode) 
      @inContext(country: $country, language: $language) {
        products(first: ${limit + 5}, query: $query) {
          nodes {
            id
            title
            handle
            vendor
            productType
            featuredImage { 
              url 
              altText
              width
              height
            }
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
            variants(first: 10) {
              nodes { 
                id 
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
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
          }
        }
      }
    `, {
      variables: { 
        query: `product_type:'${category}'`,
        country: i18n?.country || 'US',
        language: i18n?.language || 'EN'
      }
    });

    let products = res?.products?.nodes || [];
    
    // Filter out the current product and apply limit
    products = products
      .filter(p => p.id !== excludeProductId)
      .slice(0, limit);
    
    // Ensure each product has at least one variant
    return products.map(product => ({
      ...product,
      variants: {
        nodes: product.variants?.nodes?.length > 0 
          ? product.variants.nodes 
          : [{
              id: null,
              title: 'Default Title',
              availableForSale: true,
              selectedOptions: [],
              price: product.priceRange?.minVariantPrice,
              compareAtPrice: product.compareAtPriceRange?.minVariantPrice
            }]
      }
    }));
  } catch (error) {
    console.error("Error getting products by category:", error);
    return [];
  }
}

async function getProductsFromCollection(context, collectionHandle, limit, i18n) {
  try {
    const res = await context.storefront.query(`
      query getCollection($handle: String!, $first: Int!, $country: CountryCode, $language: LanguageCode) 
      @inContext(country: $country, language: $language) {
        collection(handle: $handle) {
          products(first: $first) {
            nodes {
              id
              title
              handle
              productType
              vendor
              featuredImage { 
                url 
                altText
                width
                height
              }
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
              variants(first: 10) {
                nodes { 
                  id 
                  title
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
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
            }
          }
        }
      }
    `, {
      variables: {
        handle: collectionHandle,
        first: limit,
        country: i18n?.country || 'US',
        language: i18n?.language || 'EN'
      }
    });

    let products = res?.collection?.products?.nodes || [];
    
    // Ensure each product has at least one variant
    return products.map(product => ({
      ...product,
      variants: {
        nodes: product.variants?.nodes?.length > 0 
          ? product.variants.nodes 
          : [{
              id: null,
              title: 'Default Title',
              availableForSale: true,
              selectedOptions: [],
              price: product.priceRange?.minVariantPrice,
              compareAtPrice: product.compareAtPriceRange?.minVariantPrice
            }]
      }
    }));
  } catch (error) {
    console.error("Error getting products from collection:", error);
    return [];
  }
}

async function getFallbackRecommendations(context, productId, settings, i18n) {
  if (!productId) return [];

  try {
    const res = await context.storefront.query(`
      query recs($id: ID!, $country: CountryCode, $language: LanguageCode) 
      @inContext(country: $country, language: $language) {
        productRecommendations(productId: $id) {
          id
          title
          handle
          vendor
          productType
          featuredImage { 
            url 
            altText
            width
            height
          }
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
          variants(first: 10) {
            nodes { 
              id 
              title
              availableForSale
              selectedOptions {
                name
                value
              }
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
        }
      }
    `, {
      variables: { 
        id: productId,
        country: i18n?.country || 'US',
        language: i18n?.language || 'EN'
      }
    });

    let products = res?.productRecommendations || [];
    
    // Apply limit and ensure each product has at least one variant
    return products.slice(0, settings.productsLimit).map(product => ({
      ...product,
      variants: {
        nodes: product.variants?.nodes?.length > 0 
          ? product.variants.nodes 
          : [{
              id: null,
              title: 'Default Title',
              availableForSale: true,
              selectedOptions: [],
              price: product.priceRange?.minVariantPrice,
              compareAtPrice: product.compareAtPriceRange?.minVariantPrice
            }]
      }
    }));
  } catch (error) {
    console.error("Error in fallback recommendations:", error);
    return [];
  }
}