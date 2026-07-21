import { defineType, defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const bannerSliderType = defineType({
  name: "bannerSlider",
  title: "Banner Slider",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "fullWidth",
      title: "Full Width Slider",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "height",
      title: "Slider Height (px)",
      type: "number",
      description: "Desktop height in pixels",
      initialValue: 650,
    }),
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: [
        {
          type: "object",
          name: "slide",
          fields: [
            defineField({
              name: "type",
              title: "Media Type",
              type: "string",
              options: { list: ["image", "video"] },
              initialValue: "image",
            }),
            defineField({
              name: "image",
              title: "Desktop Image",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.type !== "image",
            }),
            defineField({
              name: "video",
              title: "Desktop Video",
              type: "file",
              options: { accept: "video/*" },
              hidden: ({ parent }) => parent?.type !== "video",
            }),
            defineField({
              name: "heading",
              type: "string",
              title: "Heading",
            }),
            defineField({
              name: "subheading",
              type: "string",
              title: "Subheading",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "overlayOpacity",
      title: "Image Overlay Darkener (%)",
      type: "number",
      description: "0 for no overlay, 100 for black",
      initialValue: 30,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "styling",
      title: "Global Slider Styling",
      type: "object",
      fields: [
        { name: "backgroundColor", type: "color", title: "Background Color" },
        { name: "textColor", type: "color", title: "Text Color" },
        { name: "buttonBg", type: "color", title: "Button Background" },
        { name: "buttonText", type: "color", title: "Button Text Color" },
      ],
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "array",
      of: [{ type: "linkInternal" }, { type: "linkExternal" }],
      validation: (Rule) => Rule.max(1),
    }),
    defineField({
      name: "ctaPosition",
      title: "CTA & Text Position",
      type: "object",
      fields: [
        {
          name: "horizontal",
          type: "string",
          options: { list: ["left", "center", "right"] },
          initialValue: "center",
        },
        {
          name: "vertical",
          type: "string",
          options: { list: ["top", "center", "bottom"] },
          initialValue: "center",
        },
      ],
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay Speed (ms)",
      type: "number",
      description: "0 to disable. 5000 = 5 seconds.",
      initialValue: 5000,
    }),
    defineField({
      name: "showArrows",
      title: "Show Arrows",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Banner Slider (Image/Video)" };
    },
  },
});