import { defineType, defineField } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export const headerType = defineType({
  name: 'header',
  title: 'Header',
  type: 'object',
  icon: MenuIcon,
  groups: [
    { name: 'layout', title: 'Layout & Behavior' },
    { name: 'style', title: 'Visual Style' },
    { name: 'content', title: 'Content' },
  ],
  fields: [
    // --- LAYOUT GROUP ---
    defineField({
      name: 'variant',
      title: 'Header Type',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          { title: 'Horizontal', value: 'dropdown' },
          { title: 'Sidebar / Drawer', value: 'sidebar' },
        ],
      },
      initialValue: 'dropdown',
    }),
    defineField({
      name: 'behavior',
      title: 'Scroll Behavior',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          { title: 'Sticky (Always Visible)', value: 'sticky' },
          { title: 'Static (Disappears)', value: 'static' },
        ],
      },
      initialValue: 'sticky',
    }),
    defineField({
      name: 'alignment',
      title: 'Menu Alignment',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          { title: 'Left', value: 'justify-start' },
          { title: 'Center', value: 'justify-center' },
          { title: 'Right', value: 'justify-end' },
        ],
      },
      initialValue: 'justify-center',
      hidden: ({ parent }) => parent?.variant === 'sidebar',
    }),

    // --- STYLE GROUP ---
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      group: 'style',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color for navigation items',
      type: 'color',
      group: 'style',
    }),
     defineField({
      name: 'textColorMenu',
      title: 'Text Color for menu items',
      type: 'color',
      group: 'style',
    }),
    defineField({
      name: 'fontSize',
      title: 'Font Size',
      type: 'string',
      group: 'style',
      options: {
        list: [
          { title: 'Small', value: '14' },
          { title: 'Medium', value: '16' },
          { title: 'Large', value: '18' },
        ],
      },
      initialValue: '14',
    }),

    // --- CONTENT GROUP ---
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'menu',
      title: 'Menu Items',
      type: 'array',
      group: 'content',
      of: [{ type: 'headerMenuItem' }],
    }),
  ],
})