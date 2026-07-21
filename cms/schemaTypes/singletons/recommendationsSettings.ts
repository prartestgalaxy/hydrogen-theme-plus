import { defineField, defineType } from 'sanity'

export const recommendationsSettingsType = defineType({
  name: 'recommendationsSettings',
  title: 'Recommendations Settings',
  type: 'document',

  // =====================
  // GROUPS
  // =====================
  groups: [
    {
      name: 'general',
      title: 'General Settings',
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'logic',
      title: 'Recommendation Logic',
    },
  ],

  // =====================
  // FIELDS
  // =====================
  fields: [

    // -------------------------
    // GENERAL
    // -------------------------
    defineField({
      name: 'enabled',
      title: 'Enable Recommendations',
      type: 'boolean',
      group: 'general',
      description: 'Turn product recommendations on or off across the store',
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
        ],
      },
      initialValue: 'carousel',
    }),

    defineField({
      name: 'productsLimit',
      title: 'Number of Products',
      type: 'number',
      group: 'general',
      description: 'How many products to show in recommendations',
      initialValue: 8,
      validation: (Rule) => Rule.required().min(1).max(20),
    }),

    // -------------------------
    // CONTENT
    // -------------------------
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      group: 'content',
      initialValue: 'Recommended For You',
      validation: (Rule) => Rule.required(),
    }),

    // -------------------------
    // LOGIC
    // -------------------------
    defineField({
      name: 'algorithm',
      title: 'Recommendation Algorithm',
      type: 'string',
      group: 'logic',
      description: 'Choose how products are selected',
      initialValue: 'lastViewedCategory',
      options: {
        layout: 'radio',
        list: [
          { title: 'Last Viewed Category', value: 'lastViewedCategory' },
          { title: 'Wishlist Contains', value: 'wishlistContains' },
          { title: 'Cart Contains', value: 'cartContains' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'fallbackCollectionHandle',
      title: 'Fallback Collection Handle',
      type: 'string',
      group: 'logic',
      description:
        'Collection handle used if selected algorithm returns no products',
    }),
  ],

  // =====================
  // PREVIEW
  // =====================
  preview: {
    select: {
      enabled: 'enabled',
      algorithm: 'algorithm',
      productsLimit: 'productsLimit',
    },

    prepare({
      enabled,
      algorithm,
      productsLimit,
    }: {
      enabled: boolean
      algorithm: string
      productsLimit: number
    }) {
      return {
        title: 'Recommendations Settings',
        subtitle: enabled
          ? `✅ Enabled — ${algorithm} — ${productsLimit} products`
          : '❌ Disabled',
      }
    },
  },
})
