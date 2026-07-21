import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const aboutPageSchemaType = defineType({
  name: 'aboutPageSchema',
  title: 'About Page Schema',
  type: 'object',
  icon: UserIcon,
  groups: [
    {name: 'story', title: 'Our Story Section'},
    {name: 'feature', title: 'Feature Section'},
    {name: 'values', title: 'Core Values Section'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // --- 1. OUR STORY SECTION ---
    defineField({
      name: 'storyHeading',
      title: 'Story Heading',
      type: 'string',
      group: 'story',
      initialValue: 'OUR STORY',
    }),
    defineField({
      name: 'storyBody',
      title: 'Story Description',
      type: 'text',
      group: 'story',
      rows: 3,
    }),
    defineField({
      name: 'storyBgColor',
      title: 'Background Color',
      type: 'color',
      group: 'story',
      options: {
        disableAlpha: true,
      },
    }),

    // --- 2. FEATURE SECTION (Designed for the Elements) ---
    defineField({
      name: 'featureLayout',
      title: 'Layout',
      type: 'string',
      group: 'feature',
      options: {
        list: [
          {title: 'Image Left, Text Right', value: 'left'},
          {title: 'Text Left, Image Right', value: 'right'},
        ],
      },
      initialValue: 'right',
    }),
    defineField({
      name: 'featureImage',
      title: 'Feature Image',
      type: 'image',
      group: 'feature',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt Text'}],
    }),
    defineField({
      name: 'featureHeading',
      title: 'Feature Heading',
      type: 'string',
      group: 'feature',
    }),
    defineField({
      name: 'featureBody',
      title: 'Feature Description',
      type: 'array',
      of: [{type: 'block'}], // Rich text for multiple paragraphs
      group: 'feature',
    }),
    defineField({
      name: 'featureButton',
      title: 'Button',
      type: 'object',
      group: 'feature',
      fields: [
        {name: 'text', type: 'string', title: 'Button Text'},
        {
          name: 'link',
          type: 'array',
          title: 'Link',
          of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
          validation: (Rule) => Rule.max(1),
        },
      ],
    }),

    // --- 3. CORE VALUES SECTION ---
    defineField({
      name: 'valuesHeading',
      title: 'Section Heading',
      type: 'string',
      group: 'values',
      initialValue: 'CORE VALUES',
    }),
    defineField({
      name: 'valuesBgColor',
      title: 'Background Color',
      type: 'color',
      group: 'values',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'valuesList',
      title: 'Values List (3 items)',
      type: 'array',
      group: 'values',
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: 'object',
          fields: [
            {name: 'number', title: 'Number/Step', type: 'string', description: 'e.g., 1, 2, 3'},
            {name: 'title', title: 'Value Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 3},
          ],
        },
      ],
    }),
  ],
})
