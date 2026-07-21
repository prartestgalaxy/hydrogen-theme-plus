import { HelpCircleIcon } from '@sanity/icons'
import { defineField } from 'sanity'

export const faqType = defineField({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  groups: [
    { name: 'settings', title: 'Settings' },
    { name: 'content', title: 'Content' },
    { name: 'style', title: 'Style & Colors' },
    { name: 'layout', title: 'Layout & Sizing' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'description',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string' },
            { name: 'answer', type: 'text' },
          ],
        },
      ],
    }),
    // --- ENABLE TOGGLE ---
    defineField({
      name: 'enabled',
      title: 'Enable Section',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this section on the website.',
      group: 'settings'
    }),
    // STYLE & COLORS
    defineField({
      name: 'backgroundColor',
      title: 'Section Background',
      type: 'color',
      group: 'style',
    }),
    defineField({
      name: 'itemBgColor',
      title: 'Item Background',
      type: 'color',
      group: 'style',
    }),
    defineField({
      name: 'questionColor',
      title: 'Question Color',
      type: 'color',
      group: 'style',
    }),
    defineField({
      name: 'answerColor',
      title: 'Answer Color',
      type: 'color',
      group: 'style',
    }),
    defineField({
      name: 'accentColor',
      title: 'Icon Color',
      type: 'color',
      group: 'style',
    }),
    // LAYOUT & SIZING
    defineField({
      name: 'layoutType',
      title: 'Display Layout',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Accordion (Collapsible)', value: 'accordion'},
        ]
      },
      initialValue: 'grid'
    }),
    defineField({
      name: 'maxWidth',
      title: 'Container Width',
      type: 'string',
      options: {
        list: [
          {title: 'Narrow', value: 'max-w-3xl'},
          {title: 'Medium', value: 'max-w-5xl'},
          {title: 'Wide', value: 'max-w-7xl'},
        ]
      },
      initialValue: 'max-w-3xl',
      group: 'layout',
    }),
    defineField({
      name: 'itemPadding',
      title: 'Bar Thickness',
      type: 'string',
      options: {
        list: [
          {title: 'Compact (Thin)', value: 'compact'},
          {title: 'Normal', value: 'normal'},
          {title: 'Spacious (Thick)', value: 'spacious'},
        ]
      },
      initialValue: 'normal',
      group: 'layout',
    }),
    defineField({
      name: 'questionSize',
      title: 'Question Text Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: '14'},
          {title: 'Medium', value: '16'},
          {title: 'Large', value: '18'},
        ]
      },
      initialValue: '16',
      group: 'layout',
    }),
    defineField({
      name: 'answerSize',
      title: 'Answer Text Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: '14'},
          {title: 'Medium', value: '16'},
        ]
      },
      initialValue: '14',
      group: 'layout',
    }),
    defineField({
      name: 'cardRadius',
      type: 'string',
      options: { list: ['none', 'md', 'lg', 'full'] },
      initialValue: 'md',
      group: 'layout',
    }),
    defineField({
        name: 'titleAlign',
        type: 'string',
        options: { list: ['left', 'center', 'right'] },
        initialValue: 'center',
        group: 'layout',
      }),
  ],
})