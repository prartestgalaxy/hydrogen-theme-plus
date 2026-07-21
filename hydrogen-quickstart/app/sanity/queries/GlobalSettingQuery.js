export const GLOBAL_SETTINGS_QUERY = `
*[_type == "globalSettings"][0]{
  fontFamily,
  baseFontSize,

  headingSizes{
    h1,
    h2,
    h3,
    h4,
    h5,
    h6
  },

  buttons{
    "primaryBg": primaryBg.hex,
    "primaryText": primaryText.hex,
    "primaryHoverBg": primaryHoverBg.hex,
    "primaryHovertxt": primaryHovertxt.hex,

    "secondaryBg": secondaryBg.hex,
    "secondaryText": secondaryText.hex,
    "secondaryHoverBg": secondaryHoverBg.hex,
    "secondaryHovertxt": secondaryHovertxt.hex,

    borderRadius
  },

  linksEffect{
    "linkColor": linkColor.hex,
    "hoverColor": hoverColor.hex,
    underlineStyle,
    hoverEffect,
    transitionDuration
  },

  darkMode{
    enable,
  }
}
`