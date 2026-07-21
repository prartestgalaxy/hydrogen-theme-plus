// import {PackageIcon} from '@sanity/icons'
// import {defineField, defineType} from 'sanity'

// export const productGridType = defineType({
//   name: 'productGrid',
//   title: 'Product Grid',
//   type: 'object',
//   icon: PackageIcon,
//   groups: [
//     { name: 'content', title: 'Content' },
//     { name: 'layout', title: 'Layout & Grid' },
//     { name: 'styling', title: 'Visual Styling' },
//   ],
//   fields: [
//     /* CONTENT GROUP */
//     defineField({
//       name: 'title',
//       title: 'Title',
//       type: 'string',
//       group: 'content',
//     }),
//     defineField({
//       name: 'subtitle',
//       title: 'Subtitle (Overline)',
//       type: 'string',
//       group: 'content',
//     }),
//     defineField({
//       name: 'sourceType',
//       title: 'Product Source',
//       type: 'string',
//       options: { 
//         list: [
//           {title: 'Manual Selection', value: 'manual'}, 
//           {title: 'All Products', value: 'all'}
//         ], 
//         layout: 'radio' 
//       },
//       initialValue: 'manual',
//       group: 'content',
//     }),
//     defineField({
//       name: 'products',
//       title: 'Select Products',
//       type: 'array',
//       of: [{type: 'reference', to: [{type: 'product'}]}],
//       hidden: ({parent}) => parent?.sourceType !== 'manual',
//       group: 'content',
//     }),
//     defineField({
//       name: 'limit',
//       title: 'Product Limit',
//       description: 'Number of products to show',
//       type: 'number',
//       initialValue: 8,
//       group: 'content',
//     }),

//     /* LAYOUT GROUP */
//     defineField({
//       name: 'columnsDesktop',
//       title: 'Columns (Desktop)',
//       type: 'number',
//       options: { list: [2, 3, 4, 5] },
//       initialValue: 4,
//       group: 'layout',
//     }),
//     defineField({
//         name: 'aspectRatio',
//         title: 'Image Aspect Ratio',
//         type: 'string',
//         options: {
//           list: [
//             {title: 'Square (1:1)', value: 'aspect-square'},
//             {title: 'Portrait (3:4)', value: 'aspect-[3/4]'},
//             {title: 'Tall (2:3)', value: 'aspect-[2/3]'},
//             {title: 'Natural', value: 'aspect-auto'},
//           ]
//         },
//         initialValue: 'aspect-[3/4]',
//         group: 'layout',
//     }),
//     defineField({
//       name: 'gap',
//       title: 'Grid Gap',
//       type: 'string',
//       options: { 
//         list: [
//           {title: 'None', value: '0'}, 
//           {title: 'Small', value: '4'}, 
//           {title: 'Medium', value: '8'}, 
//           {title: 'Large', value: '12'}
//         ] 
//       },
//       initialValue: '8',
//       group: 'layout',
//     }),

//     /* STYLING GROUP */
//     defineField({
//       name: 'textAlign',
//       title: 'Text Alignment',
//       type: 'string',
//       options: { list: [{title: 'Left', value: 'left'}, {title: 'Center', value: 'center'}] },
//       initialValue: 'left',
//       group: 'styling',
//     }),
//     defineField({
//       name: 'showSecondaryImage',
//       title: 'Enable Hover Image',
//       type: 'boolean',
//       initialValue: true,
//       group: 'styling',
//     }),
//     defineField({
//       name: 'showQuickView',
//       title: 'Show Quick View Button',
//       type: 'boolean',
//       initialValue: true,
//       group: 'styling',
//     }),
//     defineField({
//       name: 'padding',
//       title: 'Section Padding',
//       type: 'string',
//       options: { 
//         list: [
//           {title: 'Small', value: 'py-12'}, 
//           {title: 'Medium', value: 'py-24'}, 
//           {title: 'Large', value: 'py-32'}
//         ] 
//       },
//       initialValue: 'py-24',
//       group: 'styling',
//     }),
//   ]
// })

import { PackageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const productGridType = defineType({
  name: 'productGrid',
  title: 'Product Grid',
  type: 'object',
  icon: PackageIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'layout', title: 'Layout & Grid' },
    { name: 'styling', title: 'Visual Styling' },
  ],
  fields: [
    defineField({
      name: 'adminLabel',
      title: 'Section Name (for admin)',
      type: 'string',
      description: 'Internal name to help identify this section in the Sanity list (e.g., "Products Grid)',
      initialValue:'Products Section'
    }),
    /* CONTENT GROUP */
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      initialValue: 'BESTSELLER PRODUCTS'
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (Overline)',
      type: 'string',
      group: 'content',
      initialValue: 'Featured Products'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      group: 'content',
      initialValue: 'Problems trying to resolve the conflict between'
    }),
    defineField({
      name: 'sourceType',
      title: 'Product Source',
      type: 'string',
      options: { 
        list: [
          { title: 'Manual Selection', value: 'manual' }, 
          { title: 'All Products', value: 'all' }
        ], 
        layout: 'radio' 
      },
      initialValue: 'manual',
      group: 'content',
    }),
    defineField({
      name: 'products',
      title: 'Select Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      hidden: ({ parent }) => parent?.sourceType !== 'manual',
      group: 'content',
    }),
    defineField({
      name: 'limit',
      title: 'Product Limit',
      description: 'Number of products to show',
      type: 'number',
      initialValue: 8,
      group: 'content',
    }),
    defineField({
      name: 'buttonText',
      title: 'Load More Button Text',
      type: 'string',
      group: 'content',
      initialValue: 'LOAD MORE PRODUCTS'
    }),

    /* LAYOUT GROUP */
    defineField({
      name: 'columnsDesktop',
      title: 'Columns (Desktop)',
      type: 'number',
      options: { list: [2, 3, 4, 5] },
      initialValue: 5,
      group: 'layout',
    }),
    defineField({
      name: 'gap',
      title: 'Grid Gap',
      type: 'string',
      options: { 
        list: [
          { title: 'None', value: '0' }, 
          { title: 'Small', value: '4' }, 
          { title: 'Medium', value: '8' }, 
          { title: 'Large', value: '12' }
        ] 
      },
      initialValue: '8',
      group: 'layout',
    }),

    /* STYLING GROUP */
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: { list: [{ title: 'Left', value: 'left' }, { title: 'Center', value: 'center' }] },
      initialValue: 'center',
      group: 'styling',
    }),
    defineField({
      name: 'buttonColor',
      title: 'Button Outline/Text Color',
      type: 'color',
      description: 'Color for the Load More button',
      group: 'styling',
      options: {disableAlpha: true}
    }),
    defineField({
      name: 'buttonTextColor',
      title: 'Button Hover Text Color',
      type: 'color',
      options: {disableAlpha: true},
      group: 'styling',
    }),
    defineField({
      name: 'showSecondaryImage',
      title: 'Enable Hover Image',
      type: 'boolean',
      initialValue: true,
      group: 'styling',
    }),
    defineField({
      name: 'showQuickView',
      title: 'Show Quick View Button',
      type: 'boolean',
      initialValue: true,
      group: 'styling',
    }),
    defineField({
      name: 'padding',
      title: 'Section Padding',
      type: 'string',
      options: { 
        list: [
          { title: 'Small', value: 'py-[50px]' }, 
          { title: 'Medium', value: 'py-[100px]' }, 
          { title: 'Large', value: 'py-[150px]' }
        ] 
      },
      initialValue: 'py-[50px]',
      group: 'styling',
    }),
  ],
   preview: {
    select: {
      adminLabel: 'adminLabel',
      title: 'title',
    },
    prepare({ adminLabel, title }) {
      return {
        title: adminLabel || title || 'Products Grid',
        subtitle: 'A grid for showing few of the products, you can show your bestsellers, special collection, new arrivals, whatever you want to group and show.',
      }
    },
  },
})