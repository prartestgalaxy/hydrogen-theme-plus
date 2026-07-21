export const INVENTORY_SETTINGS_QUERY = `
  *[_type == "inventoryThresholdSettings"][0]{
    enableInventoryBadges,
    lowStockThreshold,
    criticalStockThreshold,
    lowStockMessage,
    criticalStockMessage,
    outOfStockMessage,
    "lowStockBadgeColor": lowStockBadgeColor.hex,
    "criticalStockBadgeColor": criticalStockBadgeColor.hex,
    "outOfStockBadgeColor": outOfStockBadgeColor.hex
  }
`