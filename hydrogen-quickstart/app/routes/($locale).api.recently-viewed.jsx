// import { data } from 'react-router';

// export async function loader({ request, context }) {
//   const { storefront } = context;
//   const url = new URL(request.url);

//   const raw = url.searchParams.get('ids') ?? '';
//   const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);

//   if (!ids.length) {
//     return data({ products: [] });
//   }

//   const response = await storefront.query(RECENTLY_VIEWED_QUERY, {
//     variables: { ids }, 
//   });

//   const products = response.nodes?.filter((node) => node?.__typename === 'Product') ?? [];
//   return data({ products });
// }


// const RECENTLY_VIEWED_QUERY = `#graphql
//   query RecentlyViewedProducts(
//     $ids: [ID!]!
//     $country: CountryCode
//     $language: LanguageCode
//   ) @inContext(country: $country, language: $language) {
//     nodes(ids: $ids) {
//       __typename
//       ... on Product {
//         id
//         title
//         handle
//         featuredImage { url altText width height }
//         priceRange {
//           minVariantPrice { amount currencyCode }
//           maxVariantPrice { amount currencyCode }
//         }
//         compareAtPriceRange {
//           minVariantPrice { amount currencyCode }
//         }
//         variants(first: 1) {
//           nodes { id availableForSale currentlyNotInStock }
//         }
//       }
//     }
//   }
// `;

// app/routes/api.recently-viewed.js (or wherever your API route is)
import { data } from 'react-router';

export async function loader({ request, context }) {
  const { storefront } = context;
  const url = new URL(request.url);

  const raw = url.searchParams.get('ids') ?? '';
  const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);

  if (!ids.length) {
    return data({ products: [] });
  }

  const response = await storefront.query(RECENTLY_VIEWED_QUERY, {
    variables: { ids }, 
  });

  let products = response.nodes?.filter((node) => node?.__typename === 'Product') ?? [];
  
  // Ensure each product has variant data
  products = products.map(product => ({
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
  
  return data({ products });
}

const RECENTLY_VIEWED_QUERY = `#graphql
  query RecentlyViewedProducts(
    $ids: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      __typename
      ... on Product {
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
`;