export default function AboutPageSchemaStruct(S: any) {
  return S.listItem()
    .title('About Page Schema Settings')
    .child(
      S.document()
        .schemaType('aboutPageSchema')
        .documentId('aboutPageSchema')
        .title('About Page Schema Settings'),
    )
}
