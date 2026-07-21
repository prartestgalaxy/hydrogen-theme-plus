import {LinkIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export const linkRouteType = defineField({
  title: 'Custom Route',
  name: 'linkRoute',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'path',
      title: 'Path',
      type: 'string',
      description: 'Enter the hardcoded Hydrogen route (e.g., /products, /about, /cart)',
      validation: (Rule) => 
        Rule.required().custom((path) => {
          if (path && !path.startsWith('/')) {
            return 'Internal routes must start with a "/"'
          }
          return true
        }),
    }),
  ],
})