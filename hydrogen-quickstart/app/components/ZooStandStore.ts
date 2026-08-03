import { create } from 'zustand';

type TranslationStore = {
    language: string;
    translations: any;
    isLoading: boolean;
    error: string | null;
    setLanguage: (lang: string) => Promise<void>;
    fetchTranslations: (lang: string) => Promise<void>;
};

export const useTranslationStore = create<TranslationStore>((set, get) => ({
    language: '',
    translations: {},
    isLoading: false,
    error: null,

    setLanguage: async (lang: string) => {
        set({ language: lang });
        await get().fetchTranslations(lang);
    },

    fetchTranslations: async (lang: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/translation?key=${lang}`);
            if (!response.ok) throw new Error('Failed to fetch translations');
            const data = await response.json() as any;

            // The API returns { [lang]: translation }
            set({ translations: data[lang] || data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },
}));
