
export default function CollectionMain(S) {
  return S.listItem()
    .title('Collection Page Settings')
    .child(
      S.document()
        .schemaType('maincollectionsetting')
        .documentId('maincollectionsetting')
        .title('Collection Page Settings')
    )
}
