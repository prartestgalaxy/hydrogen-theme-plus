import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'object',
  icon: EnvelopeIcon,
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'info', title: 'Info Section'},
    {name: 'cta', title: "Let's Talk Section"},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    // --- HERO SECTION ---
    defineField({
      name: 'heroLayout',
      title: 'Hero Layout',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          {title: 'Image Left', value: 'left'},
          {title: 'Image Right', value: 'right'},
        ],
      },
      initialValue: 'right',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Alt Text'},
      ],
    }),
    defineField({
      name: 'heroOverline',
      title: 'Overline (Small text)',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadingSize',
      title: 'Hero Heading Size',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          {title: 'Small', value: 'text-3xl md:text-4xl'},
          {title: 'Medium', value: 'text-4xl md:text-5xl'},
          {title: 'Large', value: 'text-5xl md:text-6xl'},
        ],
      },
      initialValue: 'text-5xl md:text-6xl',
    }),
    defineField({
      name: 'heroAlignment',
      title: 'Hero Text Alignment',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          {title: 'Left', value: 'text-left'},
          {title: 'Center', value: 'text-center'},
          {title: 'Right', value: 'text-right'},
        ],
      },
      initialValue: 'text-left',
    }),
    defineField({
      name: 'heroBody',
      title: 'Hero Description',
      type: 'text',
      group: 'hero',
      rows: 4,
    }),
    defineField({
      name: 'heroContactInfo',
      title: 'Hero Contact Info',
      type: 'object',
      group: 'hero',
      fields: [
        {name: 'phone', type: 'string', title: 'Phone Number'},
        {name: 'fax', type: 'string', title: 'Fax Number'},
      ],
    }),
    defineField({
      name: 'heroSocialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform Name',
              type: 'string',
              options: {
                list: ['twitter', 'facebook', 'instagram', 'linkedin', 'github'],
              },
            },
            {
              name: 'link',
              title: 'URL',
              type: 'array',
              of: [{type: 'linkExternal'}],
              validation: Rule => Rule.required().max(1),
            },
          ],
        },
      ],
    }),

    // --- INFO SECTION ---
    defineField({
      name: 'infoOverline',
      title: 'Info Overline',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'infoHeading',
      title: 'Info Heading',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'infoCards',
      title: 'Info Cards (3x)',
      type: 'array',
      group: 'info',
      validation: Rule => Rule.max(3),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Use a simple icon name, e.g., phone, map-pin, envelope.',
            },
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'details', title: 'Details', type: 'text', rows: 3},
            {
              name: 'button',
              title: 'Button (Middle card only)',
              type: 'object',
              fields: [
                {name: 'text', type: 'string'},
                {name: 'link', type: 'array', of: [{type: 'linkInternal'}, {type: 'linkExternal'}], validation: Rule => Rule.max(1)},
              ],
            },
          ],
        },
      ],
    }),

    // --- CALL TO ACTION (LET'S TALK) SECTION ---
    defineField({
      name: 'ctaEnabled',
      title: 'Enable Let\'s Talk Section',
      type: 'boolean',
      group: 'cta',
      initialValue: true,
    }),
    defineField({
      name: 'ctaImage',
      title: 'CTA Icon/Image',
      type: 'image',
      group: 'cta',
      options: {hotspot: true},
    }),
    defineField({
      name: 'ctaOverline',
      title: 'CTA Overline',
      type: 'string',
      group: 'cta',
      hidden: ({parent}) => !parent?.ctaEnabled,
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      group: 'cta',
      hidden: ({parent}) => !parent?.ctaEnabled,
    }),
    defineField({
      name: 'ctaBody',
      title: 'CTA Description',
      type: 'text',
      group: 'cta',
      rows: 4,
      hidden: ({parent}) => !parent?.ctaEnabled,
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'cta',
      hidden: ({parent}) => !parent?.ctaEnabled,
    }),

    // --- POPUP FORM SETTINGS ---
    defineField({
      name: 'popupOverline',
      title: 'Popup Overline',
      type: 'string',
      group: 'cta', // Grouped under CTA for better flow
      hidden: ({parent}) => !parent?.ctaEnabled,
    }),
    defineField({
      name: 'popupHeading',
      title: 'Popup Heading',
      type: 'string',
      group: 'cta',
      hidden: ({parent}) => !parent?.ctaEnabled,
    }),
    defineField({
      name: 'popupBody',
      title: 'Popup Description',
      type: 'text',
      group: 'cta',
      hidden: ({parent}) => !parent?.ctaEnabled,
    }),
    defineField({
      name: 'popupButtonText',
      title: 'Popup Button Text',
      type: 'string',
      group: 'cta',
      hidden: ({parent}) => !parent?.ctaEnabled,
    }),
  ],
})