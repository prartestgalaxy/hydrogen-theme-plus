import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField} from 'sanity'
import { GROUPS } from '../../constants'

const TITLE = 'Home'

export const homeType = defineField({
  name: 'home',
  title: TITLE,
  type: 'document',
  icon: HomeIcon,
  groups: GROUPS,
  fields: [

    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'announcementBar', 
      group: 'editorial',
    }),

    defineField({
      name: 'header',
      title: 'Header',
      type: 'header',
    }),

     defineField({
      name: "footer",
      title: "Footer",
      type: "footerSettings",
    }),

    defineField({
      name: 'modules',
      type: 'array',
      group: 'editorial',
      of: [
        defineArrayMember({type: 'bannerSlider'}),
        defineArrayMember({type: 'heroBanner'}),
        defineArrayMember({type: 'imageWithText'}),
        defineArrayMember({type: 'productGrid'}),
        defineArrayMember({type: 'collectionCarousel'}),
        defineArrayMember({type: 'newsletter'}),
        defineArrayMember({type: 'servicesGrid'}),
        defineArrayMember({type: 'featuredBlogs'}),
        defineArrayMember({type: 'logoSlider'}),
        defineArrayMember({type: 'promotionalGrid'}),
        defineArrayMember({type: 'faq'})
      ],
    }),

    


    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        media: HomeIcon,
        subtitle: 'Index',
        title: TITLE,
      }
    },
  },
})
