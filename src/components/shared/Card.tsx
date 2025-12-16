import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-Color-Primary-Beige shadow-lg',
    elevated: 'bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 shadow-xl border border-Color-Light-300/30',
    glass: 'glass-card',
    bordered: 'bg-Color-Primary-Beige border-2 border-Color-Light-300/40',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10 lg:p-12',
  };

  const hoverAnimation = hover
    ? {
        scale: 1.02,
        y: -5,
        boxShadow: '0 20px 40px rgba(205,188,171,0.15)',
      }
    : {};

  return (
    <motion.div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} rounded-xl transition-all duration-300 ${className}`}
      whileHover={hoverAnimation}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
