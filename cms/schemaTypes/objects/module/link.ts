// link.ts
import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'page' },
          { title: 'Collection', value: 'collection' },
          { title: 'Product', value: 'product' },
          { title: 'External URL', value: 'external' },
          { title: 'Custom Route', value: 'route' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'label',
      title: 'Label Override',
      type: 'string',
    }),

    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.type !== 'page',
    }),

    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      hidden: ({ parent }) => parent?.type !== 'collection',
    }),

    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      hidden: ({ parent }) => parent?.type !== 'product',
    }),

    defineField({
      name: 'url',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'external',
    }),

   defineField({
      name: 'route',
      title: 'Route Path',
      type: 'string',
      description: 'Enter the hardcoded Hydrogen route (e.g., /products, /about, /cart)',
      hidden: ({ parent }: any) => parent?.type !== 'route', // Added 'any' type here
      validation: (Rule) =>
        Rule.custom((route, context) => {
          // Cast context.parent to any to resolve the TS error
          const parentType = (context.parent as any)?.type;
          
          if (parentType === 'route') {
            if (!route) return 'A route path is required';
            if (!route.startsWith('/')) return 'Internal routes must start with a "/"';
          }
          return true;
        }),
    }),
  ],
})
