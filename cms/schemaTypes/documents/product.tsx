import {TagIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import ProductHiddenInput from '../../components/inputs/ProductHidden'
import ShopifyDocumentStatus from '../../components/media/ShopifyDocumentStatus'
import {defineField, defineType} from 'sanity'
import {getPriceRange} from '../../utils/getPriceRange'
import {GROUPS} from '../../constants'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,

  groups: [
    ...GROUPS,
    {name: 'comparison', title: 'Comparison'},
    {name: 'details', title: 'Details Section'},
  ],

  fields: [

    // =========================
    // SHOPIFY SYNC
    // =========================
    defineField({
      name: 'hidden',
      type: 'string',
      components: {field: ProductHiddenInput},
      group: GROUPS.map((group) => group.name),
      hidden: ({parent}) => {
        const isActive = parent?.store?.status === 'active'
        const isDeleted = parent?.store?.isDeleted
        return !parent?.store || (isActive && !isDeleted)
      },
    }),

    defineField({
      name: 'titleProxy',
      title: 'Title',
      type: 'proxyString',
      options: {field: 'store.title'},
    }),

    defineField({
      name: 'slugProxy',
      title: 'Slug',
      type: 'proxyString',
      options: {field: 'store.slug.current'},
    }),

    defineField({
      name: 'store',
      type: 'shopifyProduct',
      description: 'Product data from Shopify (read-only)',
      group: 'shopifySync',
    }),

    // =========================
    // EDITORIAL
    // =========================
    defineField({
      name: 'colorTheme',
      type: 'reference',
      to: [{type: 'colorTheme'}],
      group: 'editorial',
    }),

    defineField({
      name: 'body',
      type: 'portableText',
      group: 'editorial',
    }),

    // =========================
    // SEO
    // =========================
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),

    // =========================================================
    // ================== COMPARISON SECTION ===================
    // =========================================================
    defineField({
      name: 'comparisonEnabled',
      title: 'Enable Comparison Table',
      type: 'boolean',
      initialValue: false,
      group: 'comparison',
    }),

    defineField({
      name: 'sectionHeading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Compare & Decide',
      group: 'comparison',
      hidden: ({document}) => !(document as any)?.comparisonEnabled,
    }),

    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      rows: 2,
      group: 'comparison',
      hidden: ({document}) => !(document as any)?.comparisonEnabled,
    }),

    defineField({
      name: 'competitors',
      title: 'Competitors',
      type: 'array',
      group: 'comparison',
      hidden: ({document}) => !(document as any)?.comparisonEnabled,
      of: [
        {
          type: 'object',
          icon: TagIcon,
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}],
            }),
            defineField({
              name: 'customTitle',
              title: 'Custom Column Title',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Custom Image',
              type: 'image',
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'comparisonRows',
      title: 'Comparison Criteria',
      type: 'array',
      group: 'comparison',
      hidden: ({document}) => !(document as any)?.comparisonEnabled,
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'feature',
              title: 'Feature Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ourValue',
              title: 'This Product Value',
              type: 'string',
              initialValue: 'Included',
            }),
            defineField({
              name: 'competitor1Value',
              title: 'Value for Competitor 1',
              type: 'string',
              hidden: ({document}) => !(document as any)?.competitors?.[0],
            }),
            defineField({
              name: 'competitor2Value',
              title: 'Value for Competitor 2',
              type: 'string',
              hidden: ({document}) => !(document as any)?.competitors?.[1],
            }),
            defineField({
              name: 'competitor3Value',
              title: 'Value for Competitor 3',
              type: 'string',
              hidden: ({document}) => !(document as any)?.competitors?.[2],
            }),
          ],
        },
      ],
    }),

    // =========================================================
    // =================== DETAILS TAB SECTION =================
    // =========================================================

    defineField({
      name: 'productTabsSection',
      title: 'Product Tabs Section',
      type: 'object',
      group: 'details',
      options: {collapsible: true, collapsed: false},
      fields: [

        defineField({
          name: 'enable',
          title: 'Enable Tabs Section',
          type: 'boolean',
          initialValue: true,
        }),

        // Right Side Image
        defineField({
          name: 'rightImage',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          hidden: ({parent}) => !parent?.enable,
        }),

        // Description Tab
        defineField({
          name: 'descriptionTab',
          title: 'Description Tab',
          type: 'object',
          hidden: ({parent}) => !parent?.enable,
          fields: [
            defineField({
              name: 'heading',
              title: 'Tab Heading',
              type: 'string',
              initialValue: 'Description',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'portableText',
            }),
          ],
        }),

        // Additional Info Tab
        defineField({
          name: 'additionalInfoTab',
          title: 'Additional Information Tab',
          type: 'object',
          hidden: ({parent}) => !parent?.enable,
          fields: [
            defineField({
              name: 'heading',
              title: 'Tab Heading',
              type: 'string',
              initialValue: 'Additional Information',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'portableText',
            }),
          ],
        }),

        // Reviews Tab
        defineField({
          name: 'reviewsTab',
          title: 'Reviews Tab',
          type: 'object',
          hidden: ({parent}) => !parent?.enable,
          fields: [
            defineField({
              name: 'heading',
              title: 'Tab Heading',
              type: 'string',
              initialValue: 'Reviews',
            }),

            defineField({
              name: 'reviews',
              title: 'Product Reviews',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'reviewerName',
                      title: 'Reviewer Name',
                      type: 'string',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'rating',
                      title: 'Rating (1-5)',
                      type: 'number',
                      validation: Rule => Rule.required().min(1).max(5),
                    }),
                    defineField({
                      name: 'reviewText',
                      title: 'Review Text',
                      type: 'text',
                      rows: 3,
                    }),
                    defineField({
                      name: 'reviewDate',
                      title: 'Review Date',
                      type: 'date',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'reviewerName',
                      subtitle: 'reviewText',
                    },
                  },
                },
              ],
            }),
          ],
        }),
      ],
    }),

  ],

  // =========================
  // PREVIEW
  // =========================
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      previewImageUrl: 'store.previewImageUrl',
      priceRange: 'store.priceRange',
      status: 'store.status',
      title: 'store.title',
      variants: 'store.variants',
    },
    prepare(selection) {
      const {isDeleted, previewImageUrl, priceRange, status, title, variants} = selection

      let subtitle = getPriceRange(priceRange)
      if (status !== 'active') subtitle = '(Unavailable in Shopify)'
      if (isDeleted) subtitle = '(Deleted from Shopify)'

      return {
        title,
        subtitle,
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
            title={title}
          />
        ),
      }
    },
  },
})