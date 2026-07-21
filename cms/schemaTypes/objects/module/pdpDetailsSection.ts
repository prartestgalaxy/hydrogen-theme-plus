import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'pdpDetailsSection',
  title: 'PDP Details Section',
  type: 'object',
  fields: [

    // Enable Section
    defineField({
      name: 'enable',
      title: 'Enable Details Section',
      type: 'boolean',
      initialValue: true,
    }),

    // Left Side Image
    defineField({
      name: 'leftImage',
      title: 'Left Side Image',
      type: 'image',
      options: {hotspot: true},
    }),

    // Tabs
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [

            defineField({
              name: 'tabTitle',
              title: 'Tab Title',
              type: 'string',
            }),

            defineField({
              name: 'tabContent',
              title: 'Tab Content',
              type: 'array',
              of: [{type: 'block'}], // rich text
            }),

          ],
        },
      ],
    }),

  ],
})