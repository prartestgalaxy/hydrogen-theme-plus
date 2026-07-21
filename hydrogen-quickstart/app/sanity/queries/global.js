import groq from 'groq';

export const GLOBAL_QUERY = groq`
  {
    "home": *[_type == "home"][0]{
    announcementBar {
      text,
      phoneNumber,
      email,
      socials {
        instagram,
        youtube,
        facebook,
        twitter
      },
      "backgroundColor": backgroundColor.hex,
      "textColor": textColor.hex,
      fontSize,
      fontWeight,
      letterSpacing,
      showCloseButton,
      scrolling
    },

    header {
      variant,
      behavior,
      alignment,
      "backgroundColor": backgroundColor.hex,
      "textColor": textColor.hex,
      "textColorMenu": textColorMenu.hex,
      fontSize,
      logo { asset->{ url } },
      menu[] {
        _key,
        label,
        link {
          type,
          route,
          url,
          page->{ "slug": slug.current },
          collection->{ "slug": slug.current },
          product->{ "slug": slug.current }
        },
        children[] {
          _key,
          label,
          link {
            type, route, url,
            page->{ "slug": slug.current },
            collection->{ "slug": slug.current },
            product->{ "slug": slug.current }
          }
        }
      }
    },
  
    footer {
      showFooter,
      variant,
      "backgroundColor": backgroundColor.hex,
      "textColor": textColor.hex,
      alignment,
      fontSize,
      copyright,
      "backgroundColorCpr": backgroundColorCpr.hex,
      // Logo
      logo {
        asset->{ url },
        position,
        width
      },
      socials {
        instagram,
        youtube,
        facebook,
        twitter
      },
      // Links for Simple Layout
      links[] {
        label,
        link {
          type,
          url,
          route,
          page->{ "slug": slug.current },
          collection->{ "slug": slug.current },
          product->{ "slug": slug.current }
        }
      },
      // Columns for Column Layout
      columns[] {
        title,
        links[] {
          label,
          link {
            type,
            url,
            route,
            page->{ "slug": slug.current },
            collection->{ "slug": slug.current },
            product->{ "slug": slug.current }
          }
        }
      }
    }
  },


  "settings": *[_type == "settings"][0]{
    showQuickView,
    quickViewConfig{
      contentElements[]{
        elementType,
        enabled,
        imageSize,
        titleSize,
        showCompareAtPrice,
        variantStyle,
        buttonText
      },
      styling{
        maxWidth,
        "backgroundColor": backgroundColor.hex,
        "textColor": textColor.hex,
        "buttonColor": buttonColor.hex,
        "buttonTextColor": buttonTextColor.hex,
        fontSize,
        borderRadius
      }
    }
  }

}
`;