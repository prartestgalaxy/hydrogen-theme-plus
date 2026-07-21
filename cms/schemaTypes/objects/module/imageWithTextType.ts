import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const imageWithTextType = defineType({
  name: 'imageWithText',
  title: 'Image With Text',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'adminLabel',
      title: 'Section Name (for admin)',
      type: 'string',
      description:
        'Internal name to help identify this section in the Sanity list (e.g., "Image with Text Section")',
      initialValue: 'Image with Text Section',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          {title: 'Image Left', value: 'left'},
          {title: 'Image Right', value: 'right'},
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'imageWidth',
      title: 'Image Width (%)',
      type: 'number',
      initialValue: 50,
      validation: (Rule) => Rule.min(20).max(70),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt Text'}],
    }),
    defineField({
      name: 'imageSettings',
      title: 'Image Styling',
      type: 'object',
      fields: [
        {name: 'fit', type: 'string', options: {list: ['cover', 'contain']}, initialValue: 'cover'},
        {
          name: 'aspect',
          type: 'string',
          options: {list: ['auto', 'square', 'portrait', 'landscape']},
          initialValue: 'auto',
        },
        {
          name: 'radius',
          type: 'string',
          options: {list: ['none', 'sm', 'md', 'lg', 'full']},
          initialValue: 'none',
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        {name: 'overline', type: 'string', title: 'Overline (Small text above title)'},
        {name: 'title', type: 'string'},
        {
          name: 'titleSize',
          type: 'string',
          options: {list: ['text-[30px]', 'text-[40px]', 'text-[50px]', 'text-[60px]']},
          initialValue: 'text-[40px',
        },
        {name: 'body', type: 'text', rows: 4},
        {
          name: 'alignment',
          type: 'string',
          options: {list: ['left', 'center', 'right']},
          initialValue: 'left',
        },
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Button',
      type: 'object',
      fields: [
        {name: 'text', type: 'string'},
        {
          name: 'link',
          type: 'array',
          of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
          validation: (Rule) => Rule.max(1),
        },
        {
          name: 'style',
          type: 'string',
          options: {list: ['pill', 'rounded', 'sharp', 'underline']},
          initialValue: 'sharp',
        },
        {name: 'bgColor', type: 'color', title: 'Button BG Color'},
        {name: 'textColor', type: 'color', title: 'Button Text Color'},
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Section Theme',
      type: 'object',
      fields: [
        {name: 'bg', type: 'color', title: 'Background Color'},
        {name: 'textHeading', type: 'color', title: 'Heading Text Color'},
        {name: 'text', type: 'color', title: 'Description Text Color'},
        {
          name: 'padding',
          type: 'string',
          options: {list: ['none', 'small', 'medium', 'large']},
          initialValue: 'medium',
        },
      ],
    }),
  ],
  preview: {
    select: {
      adminLabel: 'adminLabel',
      title: 'title',
    },
    prepare({adminLabel, title}) {
      return {
        title: adminLabel || title || 'Image with Text',
        subtitle:
          'Displays an image alongside text, usually with a heading, description, and optional button.',
      }
    },
  },
})
