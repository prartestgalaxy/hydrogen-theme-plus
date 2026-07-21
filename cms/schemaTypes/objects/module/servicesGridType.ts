import { ThListIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const servicesGridType = defineType({
  name: 'servicesGrid',
  title: 'Services Grid',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'adminLabel',
      title: 'Section Name (for admin)',
      type: 'string',
      description: 'Internal name to help identify this section in the Sanity list (e.g., "Services Grid)',
      initialValue:'Services Section'
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      initialValue: 'Services'
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'THE BEST SERVICES'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'features',
      title: 'Service Features',
      type: 'array',
      description: 'Add the service boxes here (recommended 3 for best layout)',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Feature Title' },
            { name: 'description', type: 'text', title: 'Feature Description', rows: 3 },
            { name: 'icon', type: 'image', title: 'Icon (SVG or PNG)', options: { hotspot: true } }
          ]
        }
      ]
    }),
    defineField({
      name: 'theme',
      title: 'Section Theme',
      type: 'object',
      fields: [
        { name: 'bg', type: 'color', title: 'Background Color' },
        { name: 'padding', type: 'string', options: { list: ['none', 'small', 'medium', 'large'] }, initialValue: 'medium' },
      ]
    })
  ],
  preview: {
    select: {
      adminLabel: 'adminLabel',
      title: 'title',
    },
    prepare({ adminLabel, title }) {
      return {
        title: adminLabel || title || 'Services Grid',
        subtitle: 'A section for showing the services you provide',
      }
    },
  },
})