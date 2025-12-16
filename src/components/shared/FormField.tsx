import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormFieldProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  success,
  hint,
  required,
  children,
  id,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-Color-Netural-Black mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      <div className="relative">
        {children}

        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error && <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />}
            {success && <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />}
          </div>
        )}
      </div>

      {hint && !error && !success && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}

      {success && (
        <p className="mt-1 text-sm text-green-600 flex items-center gap-1" role="alert">
          <CheckCircle className="w-4 h-4" aria-hidden="true" />
          {success}
        </p>
      )}
    </div>
  );
};

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  error,
  success,
  className = '',
  ...props
}) => {
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : success
    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
    : 'border-Color-Light-300 focus:ring-Color-Champagne-Gold focus:border-Color-Champagne-Gold';

  return (
    <input
      className={`w-full px-4 py-3 text-base border-2 rounded-xl
        transition-all duration-300 bg-white hover:border-Color-Champagne-Gold
        outline-none min-h-[44px] font-serif-body
        ${stateClasses} ${className}`}
      {...props}
    />
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  error,
  success,
  className = '',
  ...props
}) => {
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : success
    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
    : 'border-Color-Light-300 focus:ring-Color-Champagne-Gold focus:border-Color-Champagne-Gold';

  return (
    <textarea
      className={`w-full px-4 py-3 text-base border-2 rounded-xl
        transition-all duration-300 bg-white hover:border-Color-Champagne-Gold
        outline-none min-h-[120px] font-serif-body resize-vertical
        ${stateClasses} ${className}`}
      {...props}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  success?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  error,
  success,
  className = '',
  children,
  ...props
}) => {
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : success
    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
    : 'border-Color-Light-300 focus:ring-Color-Champagne-Gold focus:border-Color-Champagne-Gold';

  return (
    <select
      className={`w-full px-4 py-3 text-base border-2 rounded-xl
        transition-all duration-300 bg-white hover:border-Color-Champagne-Gold
        outline-none min-h-[44px] font-serif-body appearance-none
        bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23CDBCAB'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")]
        bg-[length:1.25em] bg-[position:right_0.75rem_center] bg-no-repeat pr-10
        ${stateClasses} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
