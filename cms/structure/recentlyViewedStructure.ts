import { ResetIcon } from '@sanity/icons'
import type { StructureBuilder } from 'sanity/structure' 

export default function recentlyViewedStructure(S: StructureBuilder) {
  return S.listItem()
    .title('Recently Viewed Settings')
    .icon(ResetIcon)
    .child(
      S.document()
        .schemaType('recentlyViewedSettings')
        .documentId('recentlyViewedSettings')
        .title('Recently Viewed Settings')
    )
}