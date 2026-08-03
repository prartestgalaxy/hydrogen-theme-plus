import { useTranslationStore } from "../components/ZooStandStore";

export const t = (text: string): string => {
  if (!text || typeof text !== 'string') return '';

  const { translations } = useTranslationStore.getState();

  if (!translations || typeof translations !== 'object') {
    return text.trim();
  }

  const key = text.trim();
  const found = typeof translations[key] === 'string' ? translations[key] : key;

  return found;
}
