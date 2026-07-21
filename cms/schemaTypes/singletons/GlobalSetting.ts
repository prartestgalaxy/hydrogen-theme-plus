import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'object',

  groups: [
    { name: 'typography', title: 'Typography' },
    { name: 'buttons', title: 'Buttons' },
    { name: 'linksEffect', title: 'Links Hover Effect' },
    { name: 'theme', title: 'Theme / Dark Mode' }, 
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    // =========================
    // TYPOGRAPHY
    // =========================
    defineField({
      name: 'fontFamily',
      title: 'Font Family',
      type: 'string',
      initialValue: 'Montserrat, sans-serif',
      group: 'typography',
      options: {
        list: [
          { title: 'Montserrat', value: 'Montserrat, sans-serif' },
          { title: 'Inter', value: 'Inter, sans-serif' },
          { title: 'Poppins', value: 'Poppins, sans-serif' },
          { title: 'Roboto', value: 'Roboto, sans-serif' },
          { title: 'Open Sans', value: 'Open Sans, sans-serif' },
        ],
      },
    }),

    defineField({
      name: 'baseFontSize',
      title: 'Base Font Size (px)',
      type: 'number',
      initialValue: 16,
      group: 'typography',
      validation: Rule => Rule.min(0).error('Font size cannot be negative'),
    }),

    defineField({
      name: 'headingSizes',
      title: 'Heading Sizes',
      type: 'object',
      group: 'typography',
      fields: [
        defineField({
          name: 'h1',
          title: 'H1 Size',
          type: 'number',
          initialValue: 48,
          validation: Rule => Rule.min(0).error('H1 cannot be negative'),
        }),
        defineField({
          name: 'h2',
          title: 'H2 Size',
          type: 'number',
          initialValue: 40,
          validation: Rule => Rule.min(0).error('H2 cannot be negative'),
        }),
        defineField({
          name: 'h3',
          title: 'H3 Size',
          type: 'number',
          initialValue: 32,
          validation: Rule => Rule.min(0).error('H3 cannot be negative'),
        }),
        defineField({
          name: 'h4',
          title: 'H4 Size',
          type: 'number',
          initialValue: 24,
          validation: Rule => Rule.min(0).error('H4 cannot be negative'),
        }),
        defineField({
          name: 'h5',
          title: 'H5 Size',
          type: 'number',
          initialValue: 20,
          validation: Rule => Rule.min(0).error('H5 cannot be negative'),
        }),
        defineField({
          name: 'h6',
          title: 'H6 Size',
          type: 'number',
          initialValue: 16,
          validation: Rule => Rule.min(0).error('H6 cannot be negative'),
        }),
      ],
    }),

    // =========================
    // BUTTONS
    // =========================
    defineField({
      name: 'buttons',
      title: 'Button Styles',
      type: 'object',
      group: 'buttons',
      fields: [
        defineField({ name: 'primaryBg', title: 'Primary Button Background', type: 'color' }),
        defineField({ name: 'primaryText', title: 'Primary Button Text Color', type: 'color' }),
        defineField({ name: 'primaryHoverBg', title: 'Hover : Primary Button BG Color', type: 'color' }),
        defineField({ name: 'primaryHovertxt', title: 'Hover : Primary Button Text Color', type: 'color' }),

        defineField({ name: 'secondaryBg', title: 'Secondary Button Background', type: 'color' }),
        defineField({ name: 'secondaryText', title: 'Secondary Button Text Color', type: 'color' }),
        defineField({ name: 'secondaryHoverBg', title: 'Secondary Button Hover BG', type: 'color' }),
        defineField({ name: 'secondaryHovertxt', title: 'Hover : Secondary Button Text Color', type: 'color' }),

        defineField({
          name: 'borderRadius',
          title: 'Button Border Radius',
          type: 'number',
          initialValue: 6,
          validation: Rule => Rule.min(0).error('Border radius cannot be negative'),
        }),
      ],
    }),

    // =========================
    // LINKS EFFECT
    // =========================
    defineField({
      name: 'linksEffect',
      title: 'Links Hover Effect Settings',
      type: 'object',
      group: 'linksEffect',
      fields: [

        defineField({
          name: 'linkColor',
          title: 'Default Link Color',
          type: 'color',
        }),

        defineField({
          name: 'hoverColor',
          title: 'Hover Color',
          type: 'color',
        }),

        defineField({
          name: 'underlineStyle',
          title: 'Underline Style',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Underline', value: 'underline' },
              { title: 'Overline', value: 'overline' },
              { title: 'Line Through', value: 'line-through' },
            ],
          },
          initialValue: 'none',
        }),
 
        defineField({
          name: 'hoverEffect',
          title: 'Hover Animation Type',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Underline Slide', value: 'underline-slide' },
              { title: 'Color Fade', value: 'color-fade' },
              { title: 'Grow Underline', value: 'grow-underline' },
            ],
          },
          initialValue: 'color-fade',
        }),

        defineField({
          name: 'transitionDuration',
          title: 'Transition Duration (ms)',
          type: 'number',
          initialValue: 300,
          validation: Rule => Rule.min(0).error('Transition cannot be negative'),
        }), 

      ],
    }),
    defineField({
      name: 'darkMode',
      title: 'Dark Mode Settings',
      type: 'object',
      group: 'theme',
      fields: [
        defineField({
          name: 'enable',
          title: 'Enable Dark Mode',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),

  ],
   preview: {
    select: {
      title: 'title',
    },
  },
})