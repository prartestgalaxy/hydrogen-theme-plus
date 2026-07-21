

export default function PLPPageSetting(S) {
  return S.listItem()
    .title('Product Listing Page Settings')
    .child(
      S.document()
        .schemaType('plpSettings')
        .documentId('plpSettings')
        .title('Product Listing Page Settings')
    )
}
