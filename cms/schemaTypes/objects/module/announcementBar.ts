import { defineType, defineField } from "sanity";
import { BellIcon } from "@sanity/icons";

export const announcementBarType = defineType({
  name: "announcementBar",
  title: "Announcement Bar",
  type: "object",
  icon: BellIcon,
  groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Design & Style" },
    { name: "settings", title: "Behavior" },
  ],
  fields: [
    // --- CONTENT GROUP ---
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      group: "content",
      initialValue: "(225) 555-0118",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      group: "content",
      initialValue: "michelle.rivera@example.com",
    }),
    defineField({
      name: "text",
      title: "Center Announcement Text",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
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

    // --- STYLE GROUP ---
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "color",
      group: "style",
    }),
    defineField({
      name: "textColor",
      title: "Text Color",
      type: "color",
      group: "style",
    }),
    defineField({
      name: "fontSize",
      title: "Font Size",
      type: "string",
      group: "style",
      options: {
        list: [
          { title: "Extra Small", value: "text-[12px]" },
          { title: "Small", value: "text-sm" },
          { title: "Large", value: "text-lg" },
          { title: "Extra Large", value: "text-2xl" },
        ],
      },
      initialValue: "text-[12px]",
    }),
    defineField({
      name: "fontWeight",
      title: "Font Weight",
      type: "string",
      group: "style",
      options: {
        list: [
          { title: "Normal", value: "font-normal" },
          { title: "Bold", value: "font-bold" },
        ],
      },
      initialValue: "font-bold",
    }),

    // --- SETTINGS GROUP ---
    defineField({
      name: "showCloseButton",
      title: "Show Close Button",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
  ],
});