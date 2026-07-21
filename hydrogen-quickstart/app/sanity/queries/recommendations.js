export const RECOMMENDATIONS_SETTINGS_QUERY = `
*[_type == "recommendationsSettings"][0]{
  enabled,
  layout,
  sectionTitle,
  productsLimit,
  algorithm,
  fallbackCollectionHandle
}
`
