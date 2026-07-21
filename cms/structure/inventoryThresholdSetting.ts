

export default function inventoryThresholdSettings(S) {
  return S.listItem()
    .title('inventory Threshold Settings')
    .child(
      S.document()
        .schemaType('inventoryThresholdSettings')
        .documentId('inventoryThresholdSettings')
        .title('inventory Threshold Settings')
    )
}
