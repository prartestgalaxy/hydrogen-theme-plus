export const FAQ_QUERY = `*[_id == "faq"][0] {
  _id,
  enabled,
  title,
  titleAlign,
  // Content
  items[] {
    question,
    answer
  },
  // Styling
  backgroundColor,
  itemBgColor,
  questionColor,
  answerColor,
  accentColor,
  maxWidth,
  itemPadding,
  questionSize,
  answerSize,
  cardRadius
}`;