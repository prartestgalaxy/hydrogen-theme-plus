import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'plpSettings',
  title: 'PLP Settings',
  type: 'document',

  // 🔹 TAB DEFINITIONS
  groups: [
    {
      name: 'banner',
      title: 'Banner',
    },
    {
      name: 'filters',
      title: 'Filters',
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
    // GENERAL
    // =========================
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Shop',
      group: 'general',
    }),

    defineField({
      name: 'productsPerPage',
      title: 'Products Per Page',
      type: 'number',
      initialValue: 12,
      group: 'general',
    }),

    defineField({
      name: 'enableSorting',
      title: 'Enable Sorting Dropdown',
      type: 'boolean',
      initialValue: true,
      group: 'general',
    }),

    // =========================
    // BANNER TAB
    // =========================
    defineField({
      name: 'banner',
      title: 'Top Banner Settings',
      type: 'plpBanner',
      group: 'banner',
    }),

    // =========================
    // FILTER TAB
    // =========================
    defineField({
      name: 'filters',
      title: 'Sidebar Filter Settings',
      type: 'filterSettings',
      group: 'filters',
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