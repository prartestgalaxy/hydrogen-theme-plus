export const COLLECTION_FILTERS_QUERY = `
  *[_type == "collectionFilterSettings" ][0]{
    filters {
      price,
      availability,
      tags
    }
  }
`
