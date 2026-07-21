
import groq from 'groq'
export const PLP_SETTINGS_QUERY = `
*[_type == "plpSettings"][0]{
  pageTitle,
  productsPerPage,
  enableSorting,

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
  },

  // =========================
  // LOGO SLIDER
  // =========================
  logoSlider{
    enable,
   
    autoScroll,
    speed,
    logos[]{
      alt,
      "imageUrl": image.asset->url
    }
  }
}
`