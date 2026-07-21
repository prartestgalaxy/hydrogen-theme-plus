import {ThListIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const promotionalGridType = defineType({
  name: 'promotionalGrid',
  title: 'Promotional Grid',
  type: 'object',
  icon: ThListIcon,
  groups: [
    {name: 'layout', title: 'Layout & Theme'},
    {name: 'content', title: 'Cards'},
  ],
  fields: [
    defineField({
      name: 'adminLabel',
      title: 'Section Name (for admin)',
      type: 'string',
      description: 'Internal name to help identify this section in the Sanity list (e.g., "Promotional Grid)',
      initialValue:'Promotional Section'
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'theme',
      title: 'Section Theme',
      type: 'object',
      group: 'layout',
      fields: [
        {name: 'bg', type: 'color', title: 'Background Color'},
        {name: 'padding', type: 'string', options: {list: [{title:'none', value: 'px-0'}, {title:'small' , value: 'px-8'}, {title : 'medium', value:'px-16'}, {title : 'large', value : 'px-24'}]}, initialValue: 'px-4'},
      ]
    }),
    defineField({
      name: 'cards',
      title: 'Cards (Max 4)',
      type: 'array',
      group: 'content',
      validation: (Rule) => Rule.min(1).max(4),
      of: [
        {
          type: 'object',
          fields: [
            {name: 'image', type: 'image', options: {hotspot: true}},
            {name: 'heading', type: 'string', title: 'Card Heading'},
            {name: 'headingSize', type: 'string', options: {list: ['text-lg', 'text-xl', 'text-2xl', 'text-3xl']}, initialValue: 'text-xl'},
            {name: 'headingColor', type: 'color', title: 'Heading Color'},
            {name: 'cardBg', type: 'color', title: 'Overlay Background Color'},
            {name: 'ctaText', type: 'string', title: 'Button Text', initialValue: 'Explore Items'},
            {
              name: 'link',
              title: 'Link',
              type: 'array',
              of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
              validation: (Rule) => Rule.max(1),
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      adminLabel: 'adminLabel',
      title: 'title',
    },
    prepare({ adminLabel, title }) {
      return {
        title: adminLabel || title || 'Untitled Promotional Grid',
        subtitle: 'A multi-card promotional section for highlighting campaigns, products, or collections with images and buttons.',
      }
    },
  },
})