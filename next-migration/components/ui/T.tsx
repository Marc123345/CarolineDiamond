'use client';

import React from 'react';
import { useTranslate } from '../../hooks/useTranslate';

interface TProps {
  children: string;
  context?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const T: React.FC<TProps> = ({ children, context, className, as: Component = 'span' }) => {
  const { translatedText, isLoading } = useTranslate(children, context);

  return (
    <Component className={className}>
      {isLoading ? children : translatedText}
    </Component>
  );
};
