import groq from 'groq'

export const COLLECTION_MAIN_SETTINGS_QUERY = groq`
*[_type == "maincollectionsetting"][0]{

  // =========================
  // COLLECTION SETTINGS (FLAT)
  // =========================
  "overlayColor": overlayColor.hex,
  "textColor": textColor.hex,
  alignment,

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