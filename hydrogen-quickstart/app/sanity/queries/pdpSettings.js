export const PDP_SETTINGS_QUERY = `*[_type == "pdpSettings"][0]{

  // =============================
  // GENERAL
  // =============================
  enableDetailsSection,
  enableLogoSlider,

  // =============================
  // DETAILS SECTION
  // =============================
  detailsSection{
    enable,

    "leftImage": leftImage.asset->{
      url,
      altText
    },

    tabs[]{
      tabTitle,
      tabContent
    }
  },

  // =============================
  // LOGO SLIDER
  // =============================
  logoSlider{
    enable,
    "backgroundcol": backgroundcol.hex,
    autoScroll,
    speed,
    logos[]{
      "image": image.asset->{
        url,
        altText
      },

    }
  }

}`;