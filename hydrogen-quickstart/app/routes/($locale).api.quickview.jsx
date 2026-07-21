// Resource route for Quick View product data
export async function loader({ context, params, request }) {
 
  const { storefront } = context;
  const url = new URL(request.url);
  const handle = url.searchParams.get('handle');

  

  if (!handle) {
   
    throw new Response('Product handle is required', { status: 400 });
  }

  try {
    
    const result = await storefront.query(QUICK_VIEW_PRODUCT_QUERY, {
      variables: { handle, selectedOptions: [] },
    });

  

    if (!result?.product) {
     
      return { product: null, error: 'Product not found' };
    }

    return { product: result.product };
  } catch (error) {
  
    return { product: null, error: error.message };
  }
}

const QUICK_VIEW_PRODUCT_QUERY = `#graphql
  fragment QuickViewProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    sku
    title
  }

  query QuickViewProduct(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      featuredImage {
        id
        url
        altText
        width
        height
      }
      options {
        name
        optionValues {
          name
          firstSelectableVariant {
            ...QuickViewProductVariant
          }
          swatch {
            color
            image {
              previewImage {
                url
              }
            }
          }
        }
      }
      selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...QuickViewProductVariant
      }
      variants(first: 50) {
        nodes {
          ...QuickViewProductVariant
        }
      }
    }
  }
`;
