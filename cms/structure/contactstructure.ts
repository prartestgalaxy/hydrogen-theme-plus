


export default function ContactStruct(S) {
  return S.listItem()
    .title('Contact Page Settings')
    .child(
      S.document()
        .schemaType('contactPage')
        .documentId('contactPage')
        .title('Contact Page Settings')
    )
}
