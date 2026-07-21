import groq from 'groq';

// Single source of truth for wishlist settings
export const WISHLIST_SETTINGS_QUERY = groq`
  *[_type == "wishlistSettings"][0]{
    "enabled": coalesce(enabled, false),
    "requireLogin": coalesce(requireLogin, true),
    "heartIconColor": coalesce(heartIconColor, "red-500"),
    "buttonPosition": coalesce(buttonPosition, "top-right"),
    "maxItems": coalesce(maxItems, 0),
    "showCount": coalesce(showCount, true),
    "showNotification": coalesce(showNotification, true)
  }
`;

