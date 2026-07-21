// import { defineField } from "sanity";

// export const footerType = defineField({
//   name: "footerSettings",
//   title: "Footer",
//   type: "object",
//   groups: [
//     { name: 'appearance', title: 'Appearance' },
//     { name: 'content', title: 'Content' },
//     { name: 'typography', title: 'Typography' },
//   ],
//   fields: [
//     defineField({
//       name: "showFooter",
//       title: "Show Footer",
//       type: "boolean",
//       initialValue: true,
//       group: 'appearance',
//     }),

//     // =====================
//     // LOGO SETTINGS
//     // =====================
//     defineField({
//       name: "logo",
//       title: "Footer Logo",
//       type: "image",
//       group: 'content',
//       fields: [
//         {
//           name: 'position',
//           title: 'Logo Position',
//           type: 'string',
//           options: {
//             list: [
//               { title: 'Top Left', value: 'top-left' },
//               { title: 'Top Center', value: 'top-center' },
//               { title: 'Above Copyright', value: 'bottom' },
//             ],
//           },
//           initialValue: 'top-left'
//         },
//         {
//           name: 'width',
//           title: 'Logo Width (px)',
//           type: 'number',
//           initialValue: 150
//         }
//       ]
//     }),

//     // =====================
//     // APPEARANCE & LAYOUT
//     // =====================
//     defineField({
//       name: "backgroundColor",
//       title: "Section Background Color",
//       type: "string",
//       initialValue: "#ffffff",
//       group: 'appearance',
//     }),

//     defineField({
//       name: "textColor",
//       title: "Text Color",
//       type: "string",
//       initialValue: "#000000",
//       group: 'appearance',
//     }),

//     defineField({
//       name: "alignment",
//       title: "Content Alignment",
//       type: "string",
//       options: {
//         list: [
//           { title: "Left", value: "left" },
//           { title: "Center", value: "center" },
//           { title: "Right", value: "right" },
//         ],
//       },
//       initialValue: "left",
//       group: 'appearance',
//     }),

//     defineField({
//       name: "variant",
//       title: "Layout Variant",
//       type: "string",
//       initialValue: "simple",
//       options: {
//         list: [
//           { title: "Simple (Single Row)", value: "simple" },
//           { title: "Columns (Grid)", value: "columns" },
//         ],
//       },
//       group: 'appearance',
//     }),

//     // =====================
//     // TYPOGRAPHY
//     // =====================
//     defineField({
//       name: "fontSize",
//       title: "Base Font Size",
//       type: "string",
//       options: {
//         list: [
//           { title: "Small (12px)", value: "text-xs" },
//           { title: "Normal (14px)", value: "text-sm" },
//           { title: "Large (16px)", value: "text-base" },
//         ],
//       },
//       initialValue: "text-sm",
//       group: 'typography',
//     }),

//     defineField({
//       name: "fontStyle",
//       title: "Font Weight & Style",
//       type: "array",
//       of: [{ type: "string" }],
//       options: {
//         list: [
//           { title: "Bold", value: "font-bold" },
//           { title: "Italic", value: "italic" },
//           { title: "Uppercase", value: "uppercase" },
//         ],
//       },
//       group: 'typography',
//     }),

//     // =====================
//     // LINKS & COLUMNS (FIXED WITH INLINE LABEL)
//     // =====================
//     defineField({
//       name: "links",
//       title: "Footer Links (Simple Mode)",
//       type: "array",
//       hidden: ({ parent }) => parent?.variant === "columns",
//       group: 'content',
//       of: [
//         {
//           type: "object",
//           name: "linkInternal",
//           title: "Internal Link",
//           fields: [
//             { name: "label", title: "Link Name (Display Text)", type: "string" },
//             { name: "page", title: "Internal Page", type: "reference", to: [{ type: "page" }, { type: "product" }, {type: "collection"}] }
//           ]
//         },
//         {
//           type: "object",
//           name: "linkExternal",
//           title: "External Link",
//           fields: [
//             { name: "label", title: "Link Name (Display Text)", type: "string" },
//             { name: "url", title: "URL", type: "url" }
//           ]
//         }
//       ]
//     }),

//     defineField({
//       name: "columns",
//       title: "Footer Columns (Advanced Mode)",
//       type: "array",
//       hidden: ({ parent }) => parent?.variant !== "columns",
//       group: 'content',
//       of: [
//         {
//           type: "object",
//           fields: [
//             { name: "title", type: "string", title: "Column Heading" },
//             { 
//               name: "links", 
//               type: "array", 
//               title: "Column Links",
//               of: [
//                 {
//                   type: "object",
//                   name: "linkInternal",
//                   fields: [
//                     { name: "label", title: "Link Name", type: "string" },
//                     { name: "page", type: "reference", to: [{ type: "page" }, { type: "product" }, {type: "collection"}] }
//                   ]
//                 },
//                 {
//                   type: "object",
//                   name: "linkExternal",
//                   fields: [
//                     { name: "label", title: "Link Name", type: "string" },
//                     { name: "url", type: "url" }
//                   ]
//                 }
//               ]
//             },
//           ],
//         },
//       ],
//     }),

//     defineField({
//       name: "copyright",
//       title: "Copyright Text",
//       type: "string",
//       initialValue: "© All rights reserved.",
//       group: 'content',
//     }),
//     defineField({
//       name: "backgroundColorCpr",
//       title: "Copyright Section Background Color",
//       type: "string",
//       initialValue: "#ffffff",
//       group: 'appearance',
//     }),
//   ],
// });



import { defineField } from "sanity";

export const footerType = defineField({
  name: "footerSettings",
  title: "Footer",
  type: "object",
  groups: [
    { name: 'appearance', title: 'Appearance' },
    { name: 'content', title: 'Content' },
    { name: 'typography', title: 'Typography' },
  ],
  fields: [
    defineField({
      name: "showFooter",
      title: "Show Footer",
      type: "boolean",
      initialValue: true,
      group: 'appearance',
    }),

    // =====================
    // LOGO SETTINGS
    // =====================
    defineField({
      name: "logo",
      title: "Footer Logo",
      type: "image",
      group: 'content',
      fields: [
        {
          name: 'position',
          title: 'Logo Position',
          type: 'string',
          options: {
            list: [
              { title: 'Top Left', value: 'top-left' },
              { title: 'Top Center', value: 'top-center' },
              { title: 'Above Copyright', value: 'bottom' },
            ],
          },
          initialValue: 'top-left'
        },
        {
          name: 'width',
          title: 'Logo Width (px)',
          type: 'number',
          initialValue: 150
        }
      ]
    }),
    defineField({
      name: "socials",
      title: "Social Media Links",
      type: "object",
      group: "content",
      fields: [
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "youtube", type: "url", title: "YouTube" },
        { name: "facebook", type: "url", title: "Facebook" },
        { name: "twitter", type: "url", title: "Twitter/X" },
      ]
    }),

    // =====================
    // APPEARANCE & LAYOUT
    // =====================
    defineField({
      name: "backgroundColor",
      title: "Section Background Color",
      type: "color",
      group: 'appearance',
    }),

    defineField({
      name: "textColor",
      title: "Text Color",
      type: "color",
      group: 'appearance',
    }),

    defineField({
      name: "alignment",
      title: "Content Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
      },
      initialValue: "left",
      group: 'appearance',
    }),

    defineField({
      name: "variant",
      title: "Layout Variant",
      type: "string",
      initialValue: "simple",
      options: {
        list: [
          { title: "Simple (Single Row)", value: "simple" },
          { title: "Columns (Grid)", value: "columns" },
        ],
      },
      group: 'appearance',
    }),

    // =====================
    // TYPOGRAPHY
    // =====================
    defineField({
      name: "fontSize",
      title: "Base Font Size",
      type: "string",
      options: {
        list: [
          { title: "Small (12px)", value: "12" },
          { title: "Normal (14px)", value: "14" },
          { title: "Large (16px)", value: "16" },
        ],
      },
      initialValue: "16",
      group: 'typography',
    }),

    // =====================
    // LINKS & COLUMNS (FIXED TO MATCH HEADER)
    // =====================
    defineField({
      name: "links",
      title: "Footer Links (Simple Mode)",
      type: "array",
      hidden: ({ parent }) => parent?.variant === "columns",
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Link Name (Display Text)' },
            { name: 'link', type: 'link', title: 'Link Destination' } 
          ]
        }
      ]
    }),

    defineField({
      name: "columns",
      title: "Footer Columns (Advanced Mode)",
      type: "array",
      hidden: ({ parent }) => parent?.variant !== "columns",
      group: 'content',
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Column Heading" },
            { 
              name: "links", 
              type: "array", 
              title: "Column Links",
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', type: 'string', title: 'Link Name' },
                    { name: 'link', type: 'link', title: 'Link Destination' } 
                  ]
                }
              ]
            },
          ],
        },
      ],
    }),

    // =====================
    // COPYRIGHT AREA
    // =====================
    defineField({
      name: "copyright",
      title: "Copyright Text",
      type: "string",
      initialValue: "© All rights reserved.",
      group: 'content',
    }),
    
    defineField({
      name: "backgroundColorCpr",
      title: "Copyright Section Background Color",
      type: "color",
      group: 'appearance',
    }),
  ],
});