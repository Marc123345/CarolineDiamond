import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translate as translateText } from '../utils/translations';
import { isBrowser } from '../utils/safeHydration.tsx';

type Language = 'nl' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string, context?: string) => Promise<string>;
  t: (text: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const STORAGE_KEY = 'preferred-language';

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  // Start with default value to prevent hydration mismatch
  // Load from localStorage after mount
  const [language, setLanguageState] = useState<Language>('nl');
  const [isHydrated, setIsHydrated] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());
  const [isTranslating, setIsTranslating] = useState(false);

  // Hydrate language from localStorage after mount
  useEffect(() => {
    if (!isBrowser()) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'nl') {
        setLanguageState(stored);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const translate = async (text: string, context?: string): Promise<string> => {
    if (!text || text.trim() === '') return text;

    // Try static dictionary first for common UI elements
    const staticTranslation = translateText(text, language);
    if (staticTranslation !== text) {
      return staticTranslation;
    }

    // For Dutch, return as-is (original language)
    if (language === 'nl') return text;

    // Check cache
    const cacheKey = `${text}-nl-${language}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // Call API for dynamic translation
    try {
      setIsTranslating(true);

      const apiUrl = `${process.env.VITE_SUPABASE_URL}/functions/v1/translate`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          text,
          source: 'nl',
          target: language,
          context,
        }),
      });

      if (!response.ok) {
        console.error('Translation API error:', await response.text());
        return text;
      }

      const data = await response.json();
      const translated = data.translatedText || text;

      setTranslationCache(prev => new Map(prev).set(cacheKey, translated));

      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const t = (text: string): string => {
    // Try static dictionary first for instant UI translations
    const staticTranslation = translateText(text, language);
    if (staticTranslation !== text) {
      return staticTranslation;
    }

    // For Dutch, return as-is
    if (language === 'nl') return text;

    // Check cache for API translations
    const cacheKey = `${text}-nl-${language}`;
    return translationCache.get(cacheKey) || text;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate, t, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};
