import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'collectionPageSettings',
  title: 'Collection Page Settings',
  type: 'object',

  // 🔹 GROUPS (same as PLP)
  groups: [
    { name: 'general', title: 'General' },
    { name: 'banner', title: 'Banner' },
    { name: 'filters', title: 'Filters' },
    { name: 'logos', title: 'Logo Slider' },
  ],

  fields: [

    // =========================
    // GENERAL
    // =========================
    defineField({
      name: 'pageTitle',
      title: 'Default Page Title',
      type: 'string',
      description: 'Fallback title if collection title is not used',
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

    defineField({
      name: 'enableFilters',
      title: 'Enable Filters',
      type: 'boolean',
      initialValue: true,
      group: 'general',
    }),

    // =========================
    // BANNER
    // =========================
    defineField({
      name: 'banner',
      title: 'Top Banner Settings',
      type: 'plpBanner',
      group: 'banner',
    }),

    // =========================
    // FILTERS
    // =========================
    defineField({
      name: 'filters',
      title: 'Sidebar Filter Settings',
      type: 'filterSettings',
      group: 'filters',
      hidden: ({ document }) => !document?.enableFilters,
    }),

    // =========================
    // LOGO SLIDER
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
        title: 'Collection Page Settings',
        subtitle: 'Global settings for collection pages',
      }
    },
  },
})