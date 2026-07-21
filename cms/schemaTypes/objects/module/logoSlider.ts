import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'logoSlider',
  title: 'Logo Slider',
  type: 'object',
  fields: [
    defineField({
      name: 'adminLabel',
      title: 'Section Name (for admin)',
      type: 'string',
      description: 'Internal name to help identify this section in the Sanity list (e.g., "Logo Slider)',
      initialValue:'Logo slider'
    }),
    defineField({
      name: 'enable',
      title: 'Enable Logo Slider',
      type: 'boolean',
      initialValue: true
    }),

   
    defineField({
      name: 'backgroundcol',
      title: 'Background Color',
      type: 'color'
    }),

    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [

            {
              name: 'image',
              title: 'Logo Image',
              type: 'image',
              options: { hotspot: true }
            },
          ]
        }
      ]
    }),

    defineField({
      name: 'autoScroll',
      title: 'Enable Auto Scroll',
      type: 'boolean',
      initialValue: true
    }),

    defineField({
      name: 'speed',
      title: 'Slider Speed (ms)',
      type: 'number',
      initialValue: 3000
    }),

  ],
  preview: {
    select: {
      adminLabel: 'adminLabel',
      title: 'title',
    },
    prepare({ adminLabel, title }) {
      return {
        title: adminLabel || title || 'Untitled Logo Slider',
        subtitle: 'Slider section used to display logos of partner brands, clients, or companies',
      }
    },
  },
})