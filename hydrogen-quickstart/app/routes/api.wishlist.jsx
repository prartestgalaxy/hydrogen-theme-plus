

/**
 * GET handler - Fetch the current user's wishlist
 */
export async function loader({ request, context }) {
  try {
    // ✅ 1. Check Sanity settings
    const { WISHLIST_SETTINGS_QUERY } = await import('~/sanity/queries/wishlist');
    const settings = await context.sanityClient.fetch(WISHLIST_SETTINGS_QUERY);

    if (!settings?.enabled) {
      return new Response(JSON.stringify({
        success: false,
        error: "Wishlist is currently disabled",
        disabled: true,
        items: []
      }), { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 2. Get customer access token from cookies
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/customerAccessToken=([^;]+)/);
    const accessToken = match?.[1];

    if (!accessToken) {
      return new Response(JSON.stringify({
        success: false,
        error: "Not logged in",
        requiresLogin: true,
        items: []
      }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 3. Get customer ID via Storefront API
    const customerRes = await context.storefront.query(`
      query getCustomer($token: String!) {
        customer(customerAccessToken: $token) {
          id
        }
      }
    `, { variables: { token: accessToken } });

    const customerId = customerRes?.customer?.id;
    if (!customerId) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid customer",
        items: []
      }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 4. Admin API setup
    const storeDomain = context.env.PUBLIC_STORE_DOMAIN;
    const adminToken = context.env.PRIVATE_ADMIN_TOKEN;
    const ADMIN_API_URL = `https://${storeDomain}/admin/api/2024-01/graphql.json`;

    async function adminQuery(query, variables = {}) {
      const res = await fetch(ADMIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Admin API error: ${res.status} - ${text.substring(0, 200)}`);
      return JSON.parse(text);
    }

    // 5. Fetch existing wishlist metafield
    const getWishlistQuery = `
      query getCustomerWishlist($id: ID!) {
        customer(id: $id) {
          id
          wishlist: metafield(namespace: "custom", key: "wishlist") {
            id
            value
            type
          }
        }
      }
    `;

    const getWishlistRes = await adminQuery(getWishlistQuery, { id: customerId });
    let wishlistData = { products: [] };
    const existingMetafield = getWishlistRes?.data?.customer?.wishlist;

    if (existingMetafield?.value) {
      try { 
        wishlistData = JSON.parse(existingMetafield.value); 
      } catch { 
        wishlistData = { products: [] }; 
      }
    }

    if (!wishlistData.products) wishlistData.products = [];

    // 6. Return the wishlist
    return new Response(JSON.stringify({
      success: true,
      items: wishlistData.products,
      count: wishlistData.products.length
    }), { 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("❌ Wishlist loader error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Failed to load wishlist",
      items: []
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}


// export async function action({ request, context }) {
//   try {
//     // ✅ 1. Check Sanity settings
//     const { WISHLIST_SETTINGS_QUERY } = await import('~/sanity/queries/wishlist');
//     const settings = await context.sanityClient.fetch(WISHLIST_SETTINGS_QUERY);

//     if (!settings?.enabled) {
//       return new Response(JSON.stringify({
//         success: false,
//         error: "Wishlist is currently disabled",
//         disabled: true
//       }), { 
//         status: 403, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     // 2. Get customer access token from cookies
//     const cookie = request.headers.get('cookie') || '';
//     const match = cookie.match(/customerAccessToken=([^;]+)/);
//     const accessToken = match?.[1];

//     if (!accessToken) {
//       return new Response(JSON.stringify({
//         success: false,
//         error: "Not logged in",
//         requiresLogin: true
//       }), { 
//         status: 401, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     // 3. Parse request body
//     const { 
//       productId, 
//       productTitle, 
//       productHandle, 
//       productImage, 
//       productPrice,
//       variantId,
//       variantTitle,
//       selectedOptions,
//       action = 'toggle'
//     } = await request.json();

//     if (!productId) {
//       return new Response(JSON.stringify({
//         success: false,
//         error: "Product ID is required"
//       }), { 
//         status: 400, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     // 4. Get customer ID via Storefront API
//     const customerRes = await context.storefront.query(`
//       query getCustomer($token: String!) {
//         customer(customerAccessToken: $token) {
//           id
//         }
//       }
//     `, { variables: { token: accessToken } });

//     const customerId = customerRes?.customer?.id;
//     if (!customerId) {
//       return new Response(JSON.stringify({ 
//         success: false, 
//         error: "Invalid customer" 
//       }), { 
//         status: 401, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     // 5. Admin API setup
//     const storeDomain = context.env.PUBLIC_STORE_DOMAIN;
//     const adminToken = context.env.PRIVATE_ADMIN_TOKEN;
//     const ADMIN_API_URL = `https://${storeDomain}/admin/api/2024-01/graphql.json`;

//     async function adminQuery(query, variables = {}) {
//       const res = await fetch(ADMIN_API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Access-Token": adminToken,
//         },
//         body: JSON.stringify({ query, variables }),
//       });

//       const text = await res.text();
//       if (!res.ok) throw new Error(`Admin API error: ${res.status} - ${text.substring(0, 200)}`);
//       return JSON.parse(text);
//     }

//     // 6. Fetch existing wishlist metafield
//     const getWishlistQuery = `
//       query getCustomerWishlist($id: ID!) {
//         customer(id: $id) {
//           id
//           wishlist: metafield(namespace: "custom", key: "wishlist") {
//             id
//             value
//             type
//           }
//         }
//       }
//     `;

//     const getWishlistRes = await adminQuery(getWishlistQuery, { id: customerId });
//     let wishlistData = { products: [] };
//     const existingMetafield = getWishlistRes?.data?.customer?.wishlist;

//     if (existingMetafield?.value) {
//       try { 
//         wishlistData = JSON.parse(existingMetafield.value); 
//       } catch { 
//         wishlistData = { products: [] }; 
//       }
//     }

//     if (!wishlistData.products) wishlistData.products = [];

//     // 7. Fetch productType from Shopify Storefront API
//     let productType = null;
//     let vendor = null;
//     try {
//       let shopifyProductId = productId;
//       if (!shopifyProductId.startsWith('gid://')) {
//         const numericMatch = shopifyProductId.match(/\d+/);
//         if (numericMatch) {
//           shopifyProductId = `gid://shopify/Product/${numericMatch[0]}`;
//         }
//       }

//       const productRes = await context.storefront.query(`
//         query getProduct($id: ID!) {
//           product(id: $id) {
//             productType
//             vendor
//           }
//         }
//       `, { variables: { id: shopifyProductId } });

//       productType = productRes?.product?.productType || null;
//       vendor = productRes?.product?.vendor || null;
//     } catch (e) {
//       console.error("Error fetching product details:", e);
//     }

//     // 8. Toggle product in wishlist with variant support
//     let isInWishlist = false;
//     let productIndex = -1;

//     if (variantId) {
//       // For products with variants - find by variant ID
//       productIndex = wishlistData.products.findIndex(p => p.variantId === variantId);
//       isInWishlist = productIndex !== -1;
      
//       if (action === 'toggle') {
//         if (isInWishlist) {
//           // Remove specific variant
//           wishlistData.products.splice(productIndex, 1);
         
//         } else {
//           // Add new variant
//           const numericId = productId.match(/\d+/)?.[0] || '';
//           const newItem = {
//             id: productId,
//             shopifyGid: `gid://shopify/Product/${numericId}`,
//             title: productTitle || '',
//             handle: productHandle || '',
//             image: productImage || '',
//             price: productPrice || '',
//             productType, 
//             vendor,
//             variantId: variantId,
//             variantTitle: variantTitle || null,
//             selectedOptions: selectedOptions || null,
//             addedAt: new Date().toISOString()
//           };
//           wishlistData.products.push(newItem);
         
//         }
//       }
//     } else {
//       // For products without variants - find by product ID
//       productIndex = wishlistData.products.findIndex(p => {
//         if (p.id === productId) return true;
//         const pNumeric = p.id?.match(/\d+/)?.[0];
//         const newNumeric = productId?.match(/\d+/)?.[0];
//         return pNumeric && newNumeric && pNumeric === newNumeric;
//       });
      
//       isInWishlist = productIndex !== -1;
      
//       if (action === 'toggle') {
//         if (isInWishlist) {
//           wishlistData.products.splice(productIndex, 1);
          
//         } else {
//           const numericId = productId.match(/\d+/)?.[0] || '';
//           const newItem = {
//             id: productId,
//             shopifyGid: `gid://shopify/Product/${numericId}`,
//             title: productTitle || '',
//             handle: productHandle || '',
//             image: productImage || '',
//             price: productPrice || '',
//             productType, 
//             vendor,
//             variantId: null,
//             variantTitle: null,
//             selectedOptions: null,
//             addedAt: new Date().toISOString()
//           };
//           wishlistData.products.push(newItem);
         
//         }
//       }
//     }

//     // 9. Save updated wishlist metafield
//     const updateMutation = `
//       mutation setCustomerWishlist($customerId: ID!, $wishlist: String!) {
//         customerUpdate(
//           input: {
//             id: $customerId
//             metafields: [
//               {
//                 namespace: "custom"
//                 key: "wishlist"
//                 type: "json"
//                 value: $wishlist
//               }
//             ]
//           }
//         ) {
//           customer {
//             id
//             metafield(namespace: "custom", key: "wishlist") {
//               value
//               type
//             }
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const updateRes = await adminQuery(updateMutation, {
//       customerId,
//       wishlist: JSON.stringify(wishlistData)
//     });

//     if (updateRes?.data?.customerUpdate?.userErrors?.length > 0) {
//       return new Response(JSON.stringify({
//         success: false,
//         error: "Failed to update wishlist",
//         details: updateRes.data.customerUpdate.userErrors
//       }), { 
//         status: 500, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     // 10. Return response with updated wishlist
//     return new Response(JSON.stringify({
//       success: true,
//       wishlist: wishlistData.products,
//       isInWishlist: !isInWishlist, // Toggled state
//       wishlistCount: wishlistData.products.length
//     }), { 
//       headers: { "Content-Type": "application/json" } 
//     });

//   } catch (error) {
//     console.error("❌ Wishlist API error:", error);
//     return new Response(JSON.stringify({
//       success: false,
//       error: error.message || "Internal server error"
//     }), { 
//       status: 500, 
//       headers: { "Content-Type": "application/json" } 
//     });
//   }
// }
export async function action({ request, context }) {
  try {
    // ✅ 1. Check Sanity settings
    const { WISHLIST_SETTINGS_QUERY } = await import('~/sanity/queries/wishlist');
    const settings = await context.sanityClient.fetch(WISHLIST_SETTINGS_QUERY);

    if (!settings?.enabled) {
      return new Response(JSON.stringify({
        success: false,
        error: "Wishlist is currently disabled",
        disabled: true
      }), { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 2. Get customer access token from cookies
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/customerAccessToken=([^;]+)/);
    const accessToken = match?.[1];

    if (!accessToken) {
      return new Response(JSON.stringify({
        success: false,
        error: "Not logged in",
        requiresLogin: true
      }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 3. Parse request body with variantImage support
    const { 
      productId, 
      productTitle, 
      productHandle, 
      productImage, 
      productPrice,
      variantId,
      variantTitle,
      variantImage,
      variantImageAlt,
      selectedOptions,
      action = 'toggle'
    } = await request.json();

    if (!productId) {
      return new Response(JSON.stringify({
        success: false,
        error: "Product ID is required"
      }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 4. Get customer ID via Storefront API
    const customerRes = await context.storefront.query(`
      query getCustomer($token: String!) {
        customer(customerAccessToken: $token) {
          id
        }
      }
    `, { variables: { token: accessToken } });

    const customerId = customerRes?.customer?.id;
    if (!customerId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid customer" 
      }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 5. Admin API setup
    const storeDomain = context.env.PUBLIC_STORE_DOMAIN;
    const adminToken = context.env.PRIVATE_ADMIN_TOKEN;
    const ADMIN_API_URL = `https://${storeDomain}/admin/api/2024-01/graphql.json`;

    async function adminQuery(query, variables = {}) {
      const res = await fetch(ADMIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Admin API error: ${res.status} - ${text.substring(0, 200)}`);
      return JSON.parse(text);
    }

    // 6. Fetch existing wishlist metafield
    const getWishlistQuery = `
      query getCustomerWishlist($id: ID!) {
        customer(id: $id) {
          id
          wishlist: metafield(namespace: "custom", key: "wishlist") {
            id
            value
            type
          }
        }
      }
    `;

    const getWishlistRes = await adminQuery(getWishlistQuery, { id: customerId });
    let wishlistData = { products: [] };
    const existingMetafield = getWishlistRes?.data?.customer?.wishlist;

    if (existingMetafield?.value) {
      try { 
        wishlistData = JSON.parse(existingMetafield.value); 
      } catch { 
        wishlistData = { products: [] }; 
      }
    }

    if (!wishlistData.products) wishlistData.products = [];

    // 7. Fetch productType and vendor from Shopify Storefront API
    let productType = null;
    let vendor = null;
    try {
      let shopifyProductId = productId;
      if (!shopifyProductId.startsWith('gid://')) {
        const numericMatch = shopifyProductId.match(/\d+/);
        if (numericMatch) {
          shopifyProductId = `gid://shopify/Product/${numericMatch[0]}`;
        }
      }

      const productRes = await context.storefront.query(`
        query getProduct($id: ID!) {
          product(id: $id) {
            productType
            vendor
          }
        }
      `, { variables: { id: shopifyProductId } });

      productType = productRes?.product?.productType || null;
      vendor = productRes?.product?.vendor || null;
    } catch (e) {
      console.error("Error fetching product details:", e);
    }

    // 8. If variant image is a full image object, extract URL
    let variantImageUrl = null;
    let variantImageAltText = null;
    
    if (variantImage) {
      if (typeof variantImage === 'string') {
        variantImageUrl = variantImage;
        variantImageAltText = variantImageAlt || productTitle || '';
      } else if (typeof variantImage === 'object') {
        variantImageUrl = variantImage.url || variantImage.src || null;
        variantImageAltText = variantImage.altText || variantImage.alt || productTitle || '';
      }
    }

    // 9. Toggle product in wishlist with variant support
    let isInWishlist = false;
    let productIndex = -1;

    if (variantId) {
      // For products with variants - find by variant ID
      productIndex = wishlistData.products.findIndex(p => p.variantId === variantId);
      isInWishlist = productIndex !== -1;
      
      if (action === 'toggle') {
        if (isInWishlist) {
          // Remove specific variant
          wishlistData.products.splice(productIndex, 1);
        } else {
          // Add new variant
          const numericId = productId.match(/\d+/)?.[0] || '';
          const newItem = {
            id: productId,
            shopifyGid: `gid://shopify/Product/${numericId}`,
            title: productTitle || '',
            handle: productHandle || '',
            image: variantImageUrl || productImage || '',
            imageAlt: variantImageAltText || productTitle || '',
            price: productPrice || '',
            productType, 
            vendor,
            variantId: variantId,
            variantTitle: variantTitle || null,
            variantImage: variantImageUrl || null,
            variantImageAlt: variantImageAltText || null,
            selectedOptions: selectedOptions || null,
            addedAt: new Date().toISOString()
          };
          wishlistData.products.push(newItem);
        }
      }
    } else {
      // For products without variants - find by product ID
      productIndex = wishlistData.products.findIndex(p => {
        if (p.id === productId) return true;
        const pNumeric = p.id?.match(/\d+/)?.[0];
        const newNumeric = productId?.match(/\d+/)?.[0];
        return pNumeric && newNumeric && pNumeric === newNumeric;
      });
      
      isInWishlist = productIndex !== -1;
      
      if (action === 'toggle') {
        if (isInWishlist) {
          wishlistData.products.splice(productIndex, 1);
        } else {
          const numericId = productId.match(/\d+/)?.[0] || '';
          const newItem = {
            id: productId,
            shopifyGid: `gid://shopify/Product/${numericId}`,
            title: productTitle || '',
            handle: productHandle || '',
            image: productImage || '',
            imageAlt: productTitle || '',
            price: productPrice || '',
            productType, 
            vendor,
            variantId: null,
            variantTitle: null,
            variantImage: null,
            variantImageAlt: null,
            selectedOptions: null,
            addedAt: new Date().toISOString()
          };
          wishlistData.products.push(newItem);
        }
      }
    }

    // 10. Save updated wishlist metafield
    const updateMutation = `
      mutation setCustomerWishlist($customerId: ID!, $wishlist: String!) {
        customerUpdate(
          input: {
            id: $customerId
            metafields: [
              {
                namespace: "custom"
                key: "wishlist"
                type: "json"
                value: $wishlist
              }
            ]
          }
        ) {
          customer {
            id
            metafield(namespace: "custom", key: "wishlist") {
              value
              type
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const updateRes = await adminQuery(updateMutation, {
      customerId,
      wishlist: JSON.stringify(wishlistData)
    });

    if (updateRes?.data?.customerUpdate?.userErrors?.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to update wishlist",
        details: updateRes.data.customerUpdate.userErrors
      }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 11. Return response with updated wishlist and toggled state
    return new Response(JSON.stringify({
      success: true,
      wishlist: wishlistData.products,
      isInWishlist: !isInWishlist, // Toggled state
      wishlistCount: wishlistData.products.length
    }), { 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("❌ Wishlist API error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error"
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}