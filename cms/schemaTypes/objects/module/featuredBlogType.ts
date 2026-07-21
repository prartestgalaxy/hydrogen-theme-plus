import {BlockContentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const featuredBlogsType = defineType({
  name: 'featuredBlogs',
  title: 'Featured Blogs Section',
  type: 'object',
  icon: BlockContentIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'styling', title: 'Visual Styling' },
  ],
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Section',
      type: 'boolean',
      initialValue: true,
    }),
    /* CONTENT GROUP */
    defineField({
      name: 'subtitle',
      title: 'Subtitle (Small)',
      type: 'string',
      group: 'content',
      initialValue: 'Blog'
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      initialValue: 'Latest for you'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      group: 'content',
      initialValue: 'Problems trying to resolve the conflict between'
    }),
    defineField({
      name: 'limit',
      title: 'Number of Blogs to Show',
      type: 'number',
      initialValue: 3,
      options: { list: [1, 2, 3, 4] }, 
      group: 'content',
    }),

    /* STYLING GROUP */
    defineField({
      name: 'padding',
      title: 'Section Padding',
      type: 'string',
      options: { 
        list: [
          { title: 'Small', value: 'py-12' }, 
          { title: 'Medium', value: 'py-24' }, 
          { title: 'Large', value: 'py-32' }
        ] 
      },
      initialValue: 'py-24',
      group: 'styling',
    }),
  ]
})