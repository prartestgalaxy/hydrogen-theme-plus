// sanity/queries/freeShipping.js

export const FREE_SHIPPING_SETTINGS_QUERY = `
*[_type == "freeShippingSettings"][0]{
  enabled,
  threshold,
  progressText,
  successText,
  "barColor": barColor.hex,
  "backgroundColor": backgroundColor.hex,
  showInCartDrawer,
  showOnCartPage
}
`
