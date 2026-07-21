export const CART_SETTINGS_QUERY = `
*[_type == "cartSettings"][0]{
  enablefeatureHighlightsSection,
  enableLogoSlider,

  featureHighlights{
    enable,
    features[]{
      icon{
        asset->{
          _id,
          url
        }
      },
      heading,
      description
    }
  },

  logoSlider{
    enable,
    "backgroundcol": backgroundcol.hex,
    autoScroll,
    speed,
    logos[]{
      image{
        asset->{
          _id,
          url
        }
      },
    
    }
  }
}
`