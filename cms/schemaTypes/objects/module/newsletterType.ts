import { EnvelopeIcon } from '@sanity/icons'
import { defineField } from 'sanity'

export const newsletterType = defineField({
  name: 'newsletter',
  title: 'Newsletter',
  type: 'object',
  icon: EnvelopeIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'style', title: 'Style & Colors' },
    { name: 'layout', title: 'Layout' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    defineField({ name: 'subtitle', type: 'string', group: 'content' }),
    defineField({ name: 'buttonText', type: 'string', initialValue: 'Subscribe', group: 'content' }),
    defineField({ name: 'placeholder', type: 'string', initialValue: 'your@email.com', group: 'content' }),
    
    // STYLE
    defineField({ name: 'backgroundColor', title: 'Background Color', type: 'color', group: 'style' }),
    defineField({ name: 'textColor', title: 'Text Color', type: 'color', group: 'style' }),
    defineField({ name: 'buttonBgColor', title: 'Button Background', type: 'color', group: 'style' }),
    defineField({ name: 'buttonTextColor', title: 'Button Text Color', type: 'color', group: 'style' }),
    
    // LAYOUT
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Stacked (Centered)', value: 'stacked'},
          {title: 'Split (Row)', value: 'split'},
        ]
      },
      initialValue: 'stacked',
      group: 'layout',
    }),
    defineField({
      name: 'maxWidth',
      type: 'string',
      options: {
        list: [
          {title: 'Narrow', value: 'max-w-2xl'},
          {title: 'Medium', value: 'max-w-4xl'},
          {title: 'Full', value: 'max-w-7xl'},
        ]
      },
      initialValue: 'max-w-4xl',
      group: 'layout',
    }),
    defineField({
      name: 'inputRadius',
      type: 'string',
      options: { list: ['none', 'md', 'lg', 'full'] },
      initialValue: 'md',
      group: 'layout',
    }),
  ],
})