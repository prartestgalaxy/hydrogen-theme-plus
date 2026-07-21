

export default function GlobalStruct(S) {
  return S.listItem()
    .title('Global Settings')
    .child(
      S.document()
        .schemaType('globalSettings')
        .documentId('globalSettings')
        .title('Global Setting')
    )
}
