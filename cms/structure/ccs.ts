
export default function CollectionStruct(S) {
  return S.listItem()
    .title('Collection Details Page Settings')
    .child(
      S.document()
        .schemaType('collectionPageSettings')
        .documentId('collectionPageSettings')
        .title('Collection Details Page Settings')
    )
}
