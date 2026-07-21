import { defineField, defineType } from 'sanity'

export const inventoryThresholdSettingsType = defineType({
  name: 'inventoryThresholdSettings',
  title: 'Inventory Threshold Settings',
  type: 'document',

  fields: [

    // 🔘 MASTER TOGGLE
    defineField({
      name: 'enableInventoryBadges',
      title: 'Enable Inventory Badges',
      type: 'boolean',
      initialValue: true,
      description: 'Turn ON/OFF all inventory badges globally'
    }),

    // ⚠️ LOW STOCK (Few Left)
    defineField({
      name: 'lowStockThreshold',
      title: 'Low Stock Threshold (Few Left)',
      type: 'number',
      initialValue: 10,
      description: 'Show "Few Left" message when quantity is below or equal to this number',
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .error('Low stock threshold must be at least 2'),
    }),

    // 🚨 CRITICAL STOCK (Only 3 Left)
    defineField({
      name: 'criticalStockThreshold',
      title: 'Critical Stock Threshold (Only X Left)',
      type: 'number',
      initialValue: 3,
      description: 'Show critical message when quantity is below or equal to this number',
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('Critical threshold must be at least 1'),
    }),

    // 💬 FEW LEFT MESSAGE
    defineField({
      name: 'lowStockMessage',
      title: 'Few Left Message',
      type: 'string',
      initialValue: 'Only few left',
      description: 'Message shown when stock is low but not critical',
      validation: (Rule) => Rule.required(),
    }),

    // 💬 CRITICAL MESSAGE
    defineField({
      name: 'criticalStockMessage',
      title: 'Critical Stock Message',
      type: 'string',
      initialValue: 'Only 3 left',
      description: 'Message shown when stock is critically low',
      validation: (Rule) => Rule.required(),
    }),
defineField({
  name: 'lowStockBadgeColor',
  title: 'Low Stock Badge Color',
  type: 'color',
  options: {
    disableAlpha: true,
  },
}),

defineField({
  name: 'criticalStockBadgeColor',
  title: 'Critical Stock Badge Color',
  type: 'color',
  options: {
    disableAlpha: true,
  },
}),

defineField({
  name: 'outOfStockBadgeColor',
  title: 'Out Of Stock Badge Color',
  type: 'color',
  options: {
    disableAlpha: true,
  },
}),
    // ❌ OUT OF STOCK MESSAGE
    defineField({
      name: 'outOfStockMessage',
      title: 'Out Of Stock Message',
      type: 'string',
      initialValue: 'Out of Stock',
      validation: (Rule) => Rule.required(),
    }),

  ],

  preview: {
    select: {
      enabled: 'enableInventoryBadges',
      low: 'lowStockThreshold',
      critical: 'criticalStockThreshold',
    },
    prepare({ enabled, low, critical }) {
      return {
        title: 'Inventory Threshold Settings',
        subtitle: enabled
          ? `Critical ≤ ${critical}, Low ≤ ${low}`
          : 'Inventory badges disabled',
      }
    },
  },
})