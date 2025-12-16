import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, LucideIcon } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = true,
  variant = 'outlined',
  inputSize = 'md',
  type = 'text',
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-lg'
  };

  const variantClasses = {
    outlined: 'border-2 border-gray-300 bg-white focus:border-Color-Champagne-Gold',
    filled: 'border-0 bg-Color-Primary-Beige/30 focus:bg-Color-Primary-Beige/50',
    standard: 'border-0 border-b-2 border-gray-300 rounded-none focus:border-Color-Champagne-Gold'
  };

  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
    : success
    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
    : '';

  const baseInputClasses = `
    w-full rounded-lg transition-all duration-300
    font-medium text-Color-Dark-500 placeholder-gray-400
    focus:outline-none focus:ring-4 focus:ring-Color-Champagne-Gold/30
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
    ${sizeClasses[inputSize]}
    ${variantClasses[variant]}
    ${stateClasses}
    ${LeftIcon ? 'pl-12' : ''}
    ${RightIcon || isPassword ? 'pr-12' : ''}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-Color-Dark-500 mb-2">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        {/* Input Field */}
        <motion.input
          type={inputType}
          disabled={disabled}
          className={baseInputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Right Icon / Password Toggle / Status Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {error && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          {success && !error && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {!error && !success && isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-Color-Champagne-Gold transition-colors focus:outline-none min-w-[24px] min-h-[24px]"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
          {!error && !success && !isPassword && RightIcon && (
            <RightIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Helper Text / Error / Success Messages */}
      {(error || success || helperText) && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`mt-2 text-sm ${
            error
              ? 'text-red-500'
              : success
              ? 'text-green-500'
              : 'text-gray-500'
          }`}
        >
          {error || success || helperText}
        </motion.p>
      )}
    </div>
  );
};
