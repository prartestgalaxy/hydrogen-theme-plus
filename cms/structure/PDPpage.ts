

export default function PDPPageSetting(S) {
  return S.listItem()
    .title('Product Details Page Settings')
    .child(
      S.document()
        .schemaType('pdpSettings')
        .documentId('pdpSettings')
        .title('Product Details Page Settings')
    )
}
