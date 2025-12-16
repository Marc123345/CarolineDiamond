import React from 'react';
import { useTranslation } from '../context/TranslationContext';

interface LanguageSwitcherProps {
  isTransparent?: boolean;
  isMobile?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isMobile = false
}) => {
  const { language, setLanguage } = useTranslation();

  const handleClick = (lang: 'nl' | 'en') => {
    setLanguage(lang);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col flex-shrink-0 w-full px-4 py-4">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleClick('nl')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              language === 'nl'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            🇳🇱 Nederlands
          </button>
          <button
            onClick={() => handleClick('en')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              language === 'en'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5 flex-shrink-0 border border-gray-300 rounded-md p-0.5">
      <button
        onClick={() => handleClick('nl')}
        className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
          language === 'nl'
            ? 'bg-Color-Champagne-Gold text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Switch to Dutch"
      >
        NL
      </button>
      <button
        onClick={() => handleClick('en')}
        className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
          language === 'en'
            ? 'bg-Color-Champagne-Gold text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};
