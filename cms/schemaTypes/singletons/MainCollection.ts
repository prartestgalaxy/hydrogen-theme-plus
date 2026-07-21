import { defineType, defineField } from 'sanity'

export const maincollectionsetting = defineType({
  name: 'maincollectionsetting',
  title: 'Collections Page Settings',
  type: 'object',

  groups: [
    { name: 'collections', title: 'Collection Settings' },
    { name: 'logos', title: 'Logo Slider' },
  ],

  fields: [

    // =========================
    // COLLECTION SETTINGS (FLAT FIELDS)
    // =========================

    defineField({
      name: 'overlayColor',
      title: 'Overlay Color',
      type: 'color',
      group: 'collections',
      options: {
        disableAlpha: true,
      },
    }),

    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'color',
      group: 'collections',
      options: {
        disableAlpha: true,
      },
    }),

    defineField({
      name: 'alignment',
      title: 'Content Alignment',
      type: 'string',
      group: 'collections',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'left',
    }),

    // =========================
    // LOGO SLIDER (UNCHANGED)
    // =========================
    defineField({
      name: 'logoSlider',
      title: 'Logo Slider Section',
      type: 'logoSlider',
      group: 'logos',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Collections Page Settings',
        subtitle: 'Manage collections landing page',
      }
    },
  },
})