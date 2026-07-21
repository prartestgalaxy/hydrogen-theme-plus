

export default function RecommendationProduct(S) {
  return S.listItem()
    .title('Recommendation Products Settings')
    .child(
      S.document()
        .schemaType('recommendationsSettings')
        .documentId('recommendationsSettings')
        .title('Recommendation Products Settings')
    )
}
