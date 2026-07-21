import groq from 'groq'

export const COLLECTION_PAGE_SETTINGS_QUERY = groq`
*[_type == "collectionPageSettings"][0]{
  pageTitle,
  productsPerPage,
  enableSorting,
  enableFilters,

  // =========================
  // BANNER
  // =========================
  banner{
    enable,
    cards[]{
      tagline,
      heading,
      buttonText,
      buttonLink,
      backgroundColor,
      textColor,
      imagePosition,
      "imageUrl": image.asset->url
    }
  },

  // =========================
  // FILTERS
  // =========================
  filters{
    enableSearch,
    enableCategory,
    enableBrand,
    enableColor,
    enablePrice,
    enableTags,
    priceRange{
      min,
      max
    },
    popularTags
  },

  // =========================
  // LOGO SLIDER
  // =========================
  logoSlider{
    enable,
    "backgroundcol": backgroundcol.hex,
    autoScroll,
    speed,
    logos[]{
     
      "imageUrl": image.asset->url
    }
  }
}
`