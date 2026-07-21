import {FolderIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const collectionCarouselType = defineType({
  name: 'collectionCarousel',
  title: 'Collection Carousel',
  type: 'object',
  icon: FolderIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'layout', title: 'Layout & Styling' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (Overline)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [{ type: 'reference', to: [{type: 'collection'}] }],
      group: 'content',
    }),
    defineField({
      name: 'slidesPerView',
      title: 'Slides per view (Desktop)',
      type: 'number',
      options: { list: [2, 3, 4, 5] },
      initialValue: 3,
      group: 'layout',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Image Aspect Ratio',
      type: 'string',
      options: {
        list: [
          {title: 'Square (1:1)', value: 'aspect-square'},
          {title: 'Portrait (4:5)', value: 'aspect-[4/5]'},
          {title: 'Tall (2:3)', value: 'aspect-[2/3]'},
        ]
      },
      initialValue: 'aspect-[4/5]',
      group: 'layout',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
        ]
      },
      initialValue: 'left',
      group: 'layout',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      group: 'layout',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'color',
      group: 'layout',
    }),
  ],
})