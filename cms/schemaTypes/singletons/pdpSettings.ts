import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'pdpSettings',
  title: 'PDP Settings',
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
      name: 'enableDetailsSection',
      title: 'Enable Details Section',
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
      name: 'detailsSection',
      title: 'Product Details Section',
      type: 'pdpDetailsSection',
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