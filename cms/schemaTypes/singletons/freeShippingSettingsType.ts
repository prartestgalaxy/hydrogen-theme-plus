
import {defineField, defineType} from 'sanity'

export const freeShippingSettingsType = defineType({
  name: 'freeShippingSettings',
  title: 'Free Shipping Bar Settings',
  type: 'document',
  

  groups: [
    {
      name: 'general',
      title: 'General Settings',
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'appearance',
      title: 'Appearance',
    },
  ],

  fields: [
    // -------------------------
    // GENERAL
    // -------------------------
    defineField({
      name: 'enabled',
      title: 'Enable Free Shipping Bar',
      type: 'boolean',
      group: 'general',
      description: 'Enable or disable free shipping progress bar across the store',
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'threshold',
      title: 'Free Shipping Threshold',
      type: 'number',
      group: 'general',
      description: 'Cart subtotal required to unlock free shipping',
      initialValue: 50,
      validation: (Rule) => Rule.required().min(0),
    }),

    // -------------------------
    // CONTENT
    // -------------------------
    defineField({
      name: 'progressText',
      title: 'Progress Message',
      type: 'string',
      group: 'content',
      description: 'Use {{amount}} as placeholder for remaining amount',
      initialValue: 'Spend {{amount}} more to get FREE shipping!',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'successText',
      title: 'Success Message',
      type: 'string',
      group: 'content',
      initialValue: '🎉 You unlocked FREE shipping!',
      validation: (Rule) => Rule.required(),
    }),

    // -------------------------
    // APPEARANCE
    // -------------------------
    defineField({
      name: 'barColor',
      title: 'Progress Bar Color',
      type: 'color',
      group: 'appearance',
      options: {
        disableAlpha: true,
      },
    }),

    defineField({
      name: 'backgroundColor',
      title: 'Bar Background Color',
      type: 'color',
      group: 'appearance',
      options: {
        disableAlpha: true,
      },
    }),

    defineField({
      name: 'showInCartDrawer',
      title: 'Show In Cart Drawer',
      type: 'boolean',
      group: 'appearance',
      initialValue: true,
    }),

    defineField({
      name: 'showOnCartPage',
      title: 'Show On Cart Page',
      type: 'boolean',
      group: 'appearance',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      enabled: 'enabled',
      threshold: 'threshold',
    },
    prepare({enabled, threshold}: {enabled: boolean; threshold: number}) {
      return {
        title: 'Free Shipping Bar Settings',
        subtitle: enabled
          ? `✅ Enabled — Threshold: ${threshold}`
          : '❌ Disabled',
      }
    },
  },
})
