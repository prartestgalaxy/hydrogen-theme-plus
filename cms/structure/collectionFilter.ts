

export default function Collectionfilter(S) {
  return S.listItem()
    .title('Collection Filter Settings')
    .child(
      S.document()
        .schemaType('collectionFilterSettings')
        .documentId('collectionFilterSettings')
        .title('Collection Filter Settings')
    )
}
