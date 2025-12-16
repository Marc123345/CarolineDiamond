import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  background?: 'white' | 'beige' | 'dark' | 'gradient';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  background = 'white',
  spacing = 'lg',
  className = '',
}) => {
  const backgroundClasses = {
    white: 'bg-Color-Primary-Beige',
    beige: 'bg-gradient-to-br from-Color-Netural-White via-Color-Secondary/20 to-Color-Netural-White luxury-texture',
    dark: 'bg-gradient-to-br from-Color-Netural-Black via-Color-Dark-500 to-Color-Netural-Black text-Color-Netural-White',
    gradient: 'bg-gradient-to-r from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White',
  };

  const spacingClasses = {
    none: '',
    sm: 'py-8 sm:py-10',
    md: 'py-10 sm:py-14 lg:py-18',
    lg: 'py-12 sm:py-16 lg:py-20 xl:py-24',
    xl: 'py-16 sm:py-20 lg:py-24 xl:py-28',
  };

  return (
    <section className={`${backgroundClasses[background]} ${spacingClasses[spacing]} ${className} relative overflow-hidden`}>
      {children}
    </section>
  );
};
