import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[112rem]',
    full: 'max-w-full',
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 ${className}`}>
      {children}
    </div>
  );
};
