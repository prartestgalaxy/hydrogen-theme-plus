import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'plpBanner',
  title: 'PLP Banner Section',
  type: 'object',

  fields: [

    // Enable whole banner section
    defineField({
      name: 'enable',
      title: 'Enable Banner Section',
      type: 'boolean',
      initialValue: true
    }),

    // Two Banner Cards
    defineField({
      name: 'cards',
      title: 'Banner Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [

            defineField({
              name: 'tagline',
              title: 'Small Tagline',
              type: 'string',
              description: 'Example: Ends Today'
            }),

            defineField({
              name: 'heading',
              title: 'Main Heading',
              type: 'string',
              validation: Rule => Rule.required()
            }),

            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Explore Items'
            }),

            defineField({
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string'
            }),

            defineField({
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'string',
              description: 'Example: #E8D9A8'
            }),

            defineField({
              name: 'textColor',
              title: 'Text Color',
              type: 'string',
              description: 'Example: #1F2937'
            }),

            defineField({
              name: 'image',
              title: 'Banner Image',
              type: 'image',
              options: { hotspot: true }
            }),

            defineField({
              name: 'imagePosition',
              title: 'Image Position',
              type: 'string',
              options: {
                list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Right', value: 'right'}
                ],
                layout: 'radio'
              },
              initialValue: 'right'
            }),

          ]
        }
      ],

      // Force exactly 2 cards like your design
      validation: Rule => Rule.min(2).max(2)
    }),
  ],
})