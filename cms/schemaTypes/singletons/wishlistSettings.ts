import {HeartIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const wishlistSettingsType = defineType({
  name: 'wishlistSettings',
  title: 'Wishlist Settings',
  type: 'document',
  icon: HeartIcon,
  groups: [
    {
      name: 'general',
      title: 'General Settings',
    },
    {
      name: 'appearance',
      title: 'Appearance',
    },
  ],
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Wishlist',
      type: 'boolean',
      group: 'general',
      description: 'Enable or disable wishlist functionality across the entire store',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requireLogin',
      title: 'Require Login',
      type: 'boolean',
      group: 'general',
      description: 'Require customers to login before adding items to wishlist',
      initialValue: true,
    }),
    defineField({
      name: 'heartIconColor',
      title: 'Heart Icon Color',
      type: 'string',
      group: 'appearance',
      options: {
        list: [
          {title: 'Red', value: 'red-500'},
          {title: 'Pink', value: 'pink-500'},
          {title: 'Blue', value: 'blue-500'},
          {title: 'Purple', value: 'purple-500'},
          {title: 'Green', value: 'green-500'},
        ],
      },
      initialValue: 'red-500',
    }),
    defineField({
      name: 'buttonPosition',
      title: 'Button Position',
      type: 'string',
      group: 'appearance',
      options: {
        list: [
          {title: 'Top Right', value: 'top-right'},
          {title: 'Top Left', value: 'top-left'},
          {title: 'Bottom Right', value: 'bottom-right'},
          {title: 'Bottom Left', value: 'bottom-left'},
        ],
      },
      initialValue: 'top-right',
    }),
    defineField({
      name: 'maxItems',
      title: 'Maximum Wishlist Items',
      type: 'number',
      group: 'general',
      description: 'Maximum number of items a customer can add to wishlist (0 for unlimited)',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'showCount',
      title: 'Show Wishlist Count',
      type: 'boolean',
      group: 'appearance',
      description: 'Display wishlist item count in header',
      initialValue: true,
    }),
    defineField({
      name: 'showNotification',
      title: 'Show Notification',
      type: 'boolean',
      group: 'appearance',
      description: 'Show toast notification when item is added/removed from wishlist',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
    },
    prepare({enabled}: {enabled: boolean}) {
      return {
        title: 'Wishlist Settings',
        subtitle: enabled ? '✅ Enabled' : '❌ Disabled',
        icon: HeartIcon,
      }
    },
  },
})