import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'filterSettings',
  title: 'Filter Settings',
  type: 'object',
  fields: [

    defineField({
      name: 'enableSearch',
      title: 'Enable Search Filter',
      type: 'boolean',
      initialValue: true
    }),

    defineField({
      name: 'enableCategory',
      title: 'Enable Category Filter',
      type: 'boolean',
      initialValue: true
    }),

    defineField({
      name: 'enableBrand',
      title: 'Enable Brand Filter',
      type: 'boolean',
      initialValue: true
    }),

    defineField({
      name: 'enableColor',
      title: 'Enable Color Filter',
      type: 'boolean',
      initialValue: true
    }),

    defineField({
      name: 'enablePrice',
      title: 'Enable Price Filter',
      type: 'boolean',
      initialValue: true
    }),

    defineField({
      name: 'enableTags',
      title: 'Enable Popular Tags',
      type: 'boolean',
      initialValue: true
    }),

    defineField({
      name: 'priceRange',
      title: 'Default Price Range',
      type: 'object',
      fields: [
        {
          name: 'min',
          title: 'Minimum Price',
          type: 'number',
          initialValue: 0
        },
        {
          name: 'max',
          title: 'Maximum Price',
          type: 'number',
          initialValue: 1000
        }
      ]
    }),

    defineField({
      name: 'popularTags',
      title: 'Popular Tags',
      type: 'array',
      of: [{ type: 'string' }]
    }),
  ],
})