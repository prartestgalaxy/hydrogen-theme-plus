

export default function freeShippingbar(S) {
  return S.listItem()
    .title('FreeShipping Bar Settings')
    .child(
      S.document()
        .schemaType('freeShippingSettings')
        .documentId('freeShippingSettings')
        .title('freeShipping Bar Settings')
    )
}
