import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const heroBannerType = defineType({
  name: 'heroBanner',
  title: 'Hero Banner',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'adminLabel',
      title: 'Section Name (for admin)',
      type: 'string',
      description: 'Internal name to help identify this section in the Sanity list (e.g., "Homepage - Summer Promo")',
      initialValue:'Hero Banner Section'
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          {title: 'Full Background Image', value: 'full'},
          {title: 'Image Left / Content Right', value: 'split-left'},
          {title: 'Content Left / Image Right', value: 'split-right'},
        ],
      },
      initialValue: 'full',
    }),
    defineField({
      name: 'imageWidth',
      title: 'Image Container Width (%)',
      type: 'number',
      description: 'Only applies to split layouts. Default is 50.',
      initialValue: 50,
      validation: (Rule) => Rule.min(10).max(90),
      hidden: ({parent}) => parent?.layout === 'full',
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'content',
      title: 'Content Settings',
      type: 'object',
      fields: [
        {name: 'subheading', type: 'string', title: 'Subheading'},
        {name: 'title', type: 'string', title: 'Title'},
        {name: 'titleSize', type: 'string', title: 'Title Size', options: {list: ['text-4xl', 'text-5xl', 'text-6xl', 'text-7xl']}, initialValue: 'text-5xl'},
        {name: 'titleWeight', type: 'string', title: 'Title Thickness', options: {list: ['font-light', 'font-normal', 'font-bold', 'font-black']}, initialValue: 'font-bold'},
        {name: 'subtitle', type: 'text', title: 'Subtitle', rows: 2},
        {name: 'alignment', type: 'string', title: 'Text Alignment', options: {list: ['left', 'center', 'right']}, initialValue: 'center'},
      ]
    }),
    defineField({
      name: 'colors',
      title: 'Theme Colors',
      type: 'object',
      fields: [
        {name: 'bg', type: 'color', title: 'Background Color', options: {disableAlpha: true}},
        {name: 'text', type: 'color', title: 'Text Color', options: {disableAlpha: true}},
        {name: 'overlay', type: 'number', title: 'Overlay Opacity (%)', description: 'For full background layout', initialValue: 0},
      ]
    }),
    defineField({
      name: 'cta',
      title: 'Button Styling',
      type: 'object',
      fields: [
        {name: 'text', type: 'string', title: 'Button Text'},
        {name: 'link', type: 'array', title: 'Link', of: [{type: 'linkInternal'}, {type: 'linkExternal'}], validation: (Rule) => Rule.max(1)},
        {name: 'style', type: 'string', title: 'Button Style', options: {list: ['pill', 'rounded', 'sharp', 'outline']}, initialValue: 'rounded'},
        {name: 'bgColor', type: 'color', title: 'Button BG Color', options: {disableAlpha: true}},
        {name: 'textColor', type: 'color', title: 'Button Text Color', options: {disableAlpha: true}},
      ]
    }),
  ],
  preview: {
    select: {
      adminLabel: 'adminLabel',
      title: 'title',
    },
    prepare({ adminLabel, title }) {
      return {
        title: adminLabel || title || 'Untitled Hero Banner',
        subtitle: 'Main banner section displayed at the top of the homepage. Used to highlight key messaging, promotions, or brand identity.',
      }
    },
  },
})