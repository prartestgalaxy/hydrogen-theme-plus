import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'cartSettings',
  title: 'Cart Settings',
  type: 'object',

  // 🔹 TAB GROUPS
  groups: [
    {
      name: 'details',
      title: 'Details Section',
    },
    {
      name: 'logos',
      title: 'Logo Slider',
    },
    {
      name: 'general',
      title: 'General',
    },
  ],

  fields: [

    // =========================
    // GENERAL TAB
    // =========================
    defineField({
      name: 'enablefeatureHighlightsSection',
      title: 'Enable Feature Highlight Section',
      type: 'boolean',
      initialValue: true,
      group: 'general',
    }),

    defineField({
      name: 'enableLogoSlider',
      title: 'Enable Logo Slider',
      type: 'boolean',
      initialValue: true,
      group: 'general',
    }),

    // =========================
    // DETAILS TAB
    // =========================
    defineField({
      name: 'featureHighlights',
      title: 'Feature Card Section',
      type: 'featureHighlights',
      group: 'details',
    }),

    // =========================
    // LOGO SLIDER TAB
    // =========================
    defineField({
      name: 'logoSlider',
      title: 'Logo Slider Section',
      type: 'logoSlider',
      group: 'logos',
    }),

  ],
})