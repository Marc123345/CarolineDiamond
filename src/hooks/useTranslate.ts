import { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

export const useTranslate = (text?: string, context?: string) => {
  const { translate, currentLanguage, isTranslating } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!text || currentLanguage === 'en') {
      setTranslatedText(text || '');
      return;
    }

    const doTranslate = async () => {
      setIsLoading(true);
      try {
        const result = await translate(text, context);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    doTranslate();
  }, [text, currentLanguage, context, translate]);

  if (!text) {
    return (key: string) => key;
  }

  return { translatedText, isLoading };
};
