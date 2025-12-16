import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const config = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-900',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-2 ${bgColor} ${borderColor} ${className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} aria-hidden="true" />

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold mb-1 ${textColor}`}>{title}</h4>
        )}
        <p className={`text-sm ${textColor}`}>{message}</p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${iconColor}`}
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
