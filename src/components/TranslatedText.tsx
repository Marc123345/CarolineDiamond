import React from 'react';
import { useTranslate } from '../hooks/useTranslate';

interface TranslatedTextProps {
  text: string;
  context?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  context,
  className = '',
  as: Component = 'span',
}) => {
  const { translatedText, isLoading } = useTranslate(text, context);

  return (
    <Component className={className}>
      {isLoading ? text : translatedText}
    </Component>
  );
};
