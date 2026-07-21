import { HeartIcon } from '@sanity/icons'

export default function wishlistStructure(S) {
  return S.listItem()
    .title('Wishlist Settings')
    .icon(HeartIcon)
    .child(
      S.document()
        .schemaType('wishlistSettings')
        .documentId('wishlistSettings')
        .title('Wishlist Settings')
    )
}
