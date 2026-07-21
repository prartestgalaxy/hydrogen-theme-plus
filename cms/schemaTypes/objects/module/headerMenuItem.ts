// headerMenuItem.ts
import { defineType, defineField } from 'sanity'

export const headerMenuItem = defineType({
  name: 'headerMenuItem',
  title: 'Header Menu Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'link',
      title: 'Link (optional)',
      type: 'link',
      description: 'Use this if the item is clickable itself',
    }),
    defineField({
      name: 'children',
      title: 'Sub-menu Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { 
              name: 'link', 
              type: 'link', 
              title: 'Link' 
            }, 
          ]
        }
      ]
    }),
  ],

  preview: {
    select: {
      title: 'label',
      subtitle: 'link.type',
    },
  },
})
