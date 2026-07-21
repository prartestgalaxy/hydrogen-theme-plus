export const RECENTLY_SETTINGS_QUERY = `
  *[_type == "recentlyViewedSettings"][0] {
    enabled,
    heading,
    maxProducts,
    layout
  }
`;