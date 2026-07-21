import { CogIcon, ControlsIcon, ErrorOutlineIcon, MenuIcon, SearchIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

const TITLE = 'Settings'
interface ProductOptions {
  title: string
}

export const settingsType = defineType({
  name: 'settings',
  title: TITLE,
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      default: true,
      name: 'navigation',
      title: 'Navigation',
      icon: MenuIcon,
    },
    {
      name: 'productOptions',
      title: 'Product options',
      icon: ControlsIcon,
    },
    {
      name: 'productDisplay',
      title: 'Product Display',
      icon: ControlsIcon,
    },
    {
      name: 'notFoundPage',
      title: '404 page',
      icon: ErrorOutlineIcon,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: SearchIcon,
    },
  ],
  fields: [
    defineField({
      name: 'menu',
      type: 'menu',
      group: 'navigation',
    }),
    defineField({
      name: 'footer',
      type: 'footerSettings',
      group: 'navigation',
    }),
    defineField({
      name: 'customProductOptions',
      type: 'array',
      group: 'productOptions',
      of: [
        {
          name: 'customProductOption.color',
          type: 'customProductOption.color',
        },
        {
          name: 'customProductOption.size',
          type: 'customProductOption.size',
        },
      ],
      validation: (Rule) =>
        Rule.custom((options: ProductOptions[] | undefined) => {
          // Each product option type must have a unique title
          if (options) {
            const uniqueTitles = new Set(options.map((option) => option.title))
            if (options.length > uniqueTitles.size) {
              return 'Each product option type must have a unique title'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'enableStickyAddToCart',
      title: 'Enable Sticky Add to Cart Bar',
      description: 'Shows a fixed bar at the bottom of the screen on mobile when scrolling.',
      type: 'boolean',
      initialValue: true,
      group: 'productDisplay',
    }),
    // Product Display Settings - Quick View
    defineField({
      name: 'showQuickView',
      title: 'Enable Quick View',
      type: 'boolean',
      description: 'Show Quick View button on all product cards across the site',
      initialValue: true,
      group: 'productDisplay',
    }),
    defineField({
      name: 'quickViewConfig',
      title: 'Quick View Configuration',
      type: 'object',
      group: 'productDisplay',
      hidden: ({ parent }) => !parent?.showQuickView,
      fields: [
        defineField({
          name: 'contentElements',
          title: 'Content Elements',
          description: 'Drag to reorder elements in the Quick View popup',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'elementType',
                  title: 'Element',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Product Image', value: 'image' },
                      { title: 'Product Title', value: 'title' },
                      { title: 'Product Price', value: 'price' },
                      { title: 'Variant Selector', value: 'variants' },
                      { title: 'Add to Cart Button', value: 'addToCart' },
                    ]
                  },
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'enabled',
                  title: 'Show Element',
                  type: 'boolean',
                  initialValue: true,
                },
                {
                  name: 'imageSize',
                  title: 'Image Size',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Small', value: 'small' },
                      { title: 'Medium', value: 'medium' },
                      { title: 'Large', value: 'large' },
                    ]
                  },
                  initialValue: 'medium',
                  hidden: ({ parent }) => parent?.elementType !== 'image',
                },
                {
                  name: 'titleSize',
                  title: 'Title Size',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Small', value: 'text-xl' },
                      { title: 'Medium', value: 'text-2xl' },
                      { title: 'Large', value: 'text-3xl' },
                    ]
                  },
                  initialValue: 'text-2xl',
                  hidden: ({ parent }) => parent?.elementType !== 'title',
                },
                {
                  name: 'showCompareAtPrice',
                  title: 'Show Compare at Price',
                  type: 'boolean',
                  initialValue: true,
                  hidden: ({ parent }) => parent?.elementType !== 'price',
                },
                {
                  name: 'variantStyle',
                  title: 'Variant Style',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Buttons', value: 'buttons' },
                      { title: 'Dropdown', value: 'dropdown' },
                    ]
                  },
                  initialValue: 'buttons',
                  hidden: ({ parent }) => parent?.elementType !== 'variants',
                },
                {
                  name: 'buttonText',
                  title: 'Button Text',
                  type: 'string',
                  initialValue: 'Add to Cart',
                  hidden: ({ parent }) => parent?.elementType !== 'addToCart',
                },
              ],
              preview: {
                select: {
                  elementType: 'elementType',
                  enabled: 'enabled',
                },
                prepare({ elementType, enabled }: { elementType: string; enabled: boolean }) {
                  const titles: Record<string, string> = {
                    image: 'Product Image',
                    title: 'Product Title',
                    price: 'Product Price',
                    variants: 'Variant Selector',
                    addToCart: 'Add to Cart Button',
                  };
                  return {
                    title: titles[elementType] || elementType,
                    subtitle: enabled ? 'Visible' : 'Hidden',
                  };
                },
              },
            },
          ],
          initialValue: [
            { elementType: 'image', enabled: true, imageSize: 'medium' },
            { elementType: 'title', enabled: true, titleSize: 'text-2xl' },
            { elementType: 'price', enabled: true, showCompareAtPrice: true },
            { elementType: 'variants', enabled: true, variantStyle: 'buttons' },
            { elementType: 'addToCart', enabled: true, buttonText: 'Add to Cart' },
          ],
        }),
        defineField({
          name: 'styling',
          title: 'Popup Styling',
          type: 'object',
          fields: [
            {
              name: 'maxWidth',
              title: 'Max Width',
              type: 'string',
              options: {
                list: [
                  { title: 'Small (600px)', value: 'max-w-[600px]' },
                  { title: 'Medium (800px)', value: 'max-w-[800px]' },
                  { title: 'Large (1000px)', value: 'max-w-[1000px]' },
                ]
              },
              initialValue: 'max-w-[800px]',
            },
            {
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'color',
            },
            {
              name: 'textColor',
              title: 'Text Color',
              type: 'color',
            },
            {
              name: 'buttonColor',
              title: 'Button Color',
              type: 'color',
            },
            {
              name: 'buttonTextColor',
              title: 'Button Text Color',
              type: 'color',
            },
            {
              name: 'fontSize',
              title: 'Base Font Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Small', value: 'text-sm' },
                  { title: 'Medium', value: 'text-base' },
                  { title: 'Large', value: 'text-lg' },
                ]
              },
              initialValue: 'text-base',
            },
            {
              name: 'borderRadius',
              title: 'Border Radius',
              type: 'string',
              options: {
                list: [
                  { title: 'None', value: 'rounded-none' },
                  { title: 'Small', value: 'rounded-sm' },
                  { title: 'Medium', value: 'rounded-md' },
                  { title: 'Large', value: 'rounded-lg' },
                  { title: 'XL', value: 'rounded-xl' },
                  { title: '2XL', value: 'rounded-2xl' },
                ]
              },
              initialValue: 'rounded-xl',
            },
          ],
          initialValue: {
            maxWidth: 'max-w-[800px]',
            backgroundColor: '#ffffff',
            textColor: '#000000',
            buttonColor: '#000000',
            buttonTextColor: '#ffffff',
            fontSize: 'text-base',
            borderRadius: 'rounded-xl',
          },
        }),
      ],
    }),
    // Not found page
    defineField({
      name: 'notFoundPage',
      title: '404 page',
      type: 'notFoundPage',
      group: 'notFoundPage',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      }
    },
  },
})
