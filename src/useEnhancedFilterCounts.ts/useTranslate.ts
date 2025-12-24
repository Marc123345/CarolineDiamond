import { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

export const useTranslate = (text: string, context?: string) => {
  const { language, translate, t } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (language === 'nl') {
      setTranslatedText(text);
      return;
    }

    const cachedTranslation = t(text);
    if (cachedTranslation !== text) {
      setTranslatedText(cachedTranslation);
      return;
    }

    let isMounted = true;

    const performTranslation = async () => {
      setIsLoading(true);
      try {
        const translated = await translate(text, context);
        if (isMounted) {
          setTranslatedText(translated);
        }
      } catch (error) {
        console.error('Translation error:', error);
        if (isMounted) {
          setTranslatedText(text);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [text, language, context]);

  return { translatedText, isLoading };
};
