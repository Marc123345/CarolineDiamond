import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'text' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-Color-Champagne-Gold/30';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-8 py-4 min-h-[44px]',
    lg: 'px-10 py-5 text-lg min-h-[52px]',
    xl: 'px-12 py-6 text-xl min-h-[60px]',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    text: 'btn--text',
    outline: 'border-2 border-Color-Champagne-Gold text-Color-Champagne-Gold hover:bg-Color-Champagne-Gold hover:text-white',
    ghost: 'text-Color-Champagne-Gold hover:bg-Color-Primary-Beige/50',
  };

  const disabledClass = (disabled || loading) ? 'btn-disabled' : '';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onClick?.();
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="mr-3 h-5 w-5" />
      ) : null}
      <span className="relative z-10">{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="ml-3 h-5 w-5" />}
    </motion.button>
  );
};
