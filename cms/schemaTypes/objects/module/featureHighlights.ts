import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'featureHighlights',
  title: 'Feature Highlights',
  type: 'object',
  fields: [

    defineField({
      name: 'enable',
      title: 'Enable Section',
      type: 'boolean',
      initialValue: true
    }),

    defineField({
      name: 'features',
      title: 'Feature Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [

            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: { hotspot: true }
            }),

            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: Rule => Rule.required()
            }),

            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3
            }),

          ]
        }
      ]
    }),

  ],
})