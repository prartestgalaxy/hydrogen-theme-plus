import { ResetIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export const recentlyViewed = defineType({
  name: 'recentlyViewedSettings', 
  title: 'Recently Viewed Settings',
  type: 'document', 
  icon: ResetIcon, 
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Recently Viewed',
    }),
    defineField({
      name: 'maxProducts',
      title: 'Number of Products to Show (for grid layout only)',
      type: 'number',
      initialValue: 4,
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
  ],
})