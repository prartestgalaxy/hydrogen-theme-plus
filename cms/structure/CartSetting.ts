

export default function CartPageSetting(S) {
  return S.listItem()
    .title('Cart Page Settings')
    .child(
      S.document()
        .schemaType('cartSettings')
        .documentId('cartSettings')
        .title('Cart Details Page Settings')
    )
}
