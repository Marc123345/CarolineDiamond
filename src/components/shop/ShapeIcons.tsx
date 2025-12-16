import React from 'react';

interface ShapeIconProps {
  shape: string;
  className?: string;
  size?: number;
}

export const ShapeIcon: React.FC<ShapeIconProps> = ({ shape, className = '', size = 40 }) => {
  const getShapeIcon = () => {
    switch (shape.toLowerCase()) {
      case 'round':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
            <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
          </svg>
        );

      case 'oval':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
            <ellipse cx="20" cy="20" rx="12" ry="16" stroke="currentColor" strokeWidth="2" fill="none"/>
            <ellipse cx="20" cy="20" rx="9" ry="13" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <ellipse cx="20" cy="20" rx="6" ry="10" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
          </svg>
        );

      case 'princess':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
            <rect x="8" y="8" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"/>
            <rect x="11" y="11" width="18" height="18" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <line x1="8" y1="8" x2="32" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
            <line x1="32" y1="8" x2="8" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
          </svg>
        );

      case 'pear':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
            <path d="M20 5 C15 8, 10 13, 10 20 C10 27, 14 32, 20 35 C26 32, 30 27, 30 20 C30 13, 25 8, 20 5 Z"
                  stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M20 9 C16 11, 13 15, 13 20 C13 25, 16 29, 20 31 C24 29, 27 25, 27 20 C27 15, 24 11, 20 9 Z"
                  stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          </svg>
        );

      case 'marquise':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
            <path d="M20 5 C25 8, 32 14, 32 20 C32 26, 25 32, 20 35 C15 32, 8 26, 8 20 C8 14, 15 8, 20 5 Z"
                  stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M20 9 C24 11, 29 16, 29 20 C29 24, 24 29, 20 31 C16 29, 11 24, 11 20 C11 16, 16 11, 20 9 Z"
                  stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          </svg>
        );

      case 'emerald':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
            <path d="M12 8 L28 8 L32 12 L32 28 L28 32 L12 32 L8 28 L8 12 Z"
                  stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M14 11 L26 11 L29 14 L29 26 L26 29 L14 29 L11 26 L11 14 Z"
                  stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <line x1="12" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
          </svg>
        );

      case 'cushion':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
            <rect x="10" y="10" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/>
            <rect x="13" y="13" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <line x1="10" y1="10" x2="30" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
            <line x1="30" y1="10" x2="10" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
          </svg>
        );

      default:
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
            <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        );
    }
  };

  return getShapeIcon();
};

export const RingStyleIcon: React.FC<{ style: string; className?: string; size?: number }> = ({
  style,
  className = '',
  size = 40
}) => {
  const getStyleIcon = () => {
    const lowerStyle = style.toLowerCase();

    if (lowerStyle.includes('solitaire') && lowerStyle.includes('side')) {
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
          <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.6"/>
          <circle cx="28" cy="20" r="2" fill="currentColor" opacity="0.6"/>
          <circle cx="15" cy="15" r="1.5" fill="currentColor" opacity="0.4"/>
          <circle cx="25" cy="15" r="1.5" fill="currentColor" opacity="0.4"/>
          <circle cx="15" cy="25" r="1.5" fill="currentColor" opacity="0.4"/>
          <circle cx="25" cy="25" r="1.5" fill="currentColor" opacity="0.4"/>
        </svg>
      );
    }

    if (lowerStyle.includes('solitaire')) {
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
          <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
        </svg>
      );
    }

    if (lowerStyle.includes('halo') && lowerStyle.includes('side')) {
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
          <circle cx="20" cy="20" r="4" fill="currentColor"/>
          <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1" fill="none"/>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 20 + 8 * Math.cos(rad);
            const y = 20 + 8 * Math.sin(rad);
            return <circle key={i} cx={x} cy={y} r="1.5" fill="currentColor" opacity="0.6"/>;
          })}
          <circle cx="10" cy="20" r="2" fill="currentColor" opacity="0.4"/>
          <circle cx="30" cy="20" r="2" fill="currentColor" opacity="0.4"/>
        </svg>
      );
    }

    if (lowerStyle.includes('halo')) {
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
          <circle cx="20" cy="20" r="5" fill="currentColor"/>
          <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" fill="none"/>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 20 + 10 * Math.cos(rad);
            const y = 20 + 10 * Math.sin(rad);
            return <circle key={i} cx={x} cy={y} r="2" fill="currentColor" opacity="0.6"/>;
          })}
        </svg>
      );
    }

    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    );
  };

  return getStyleIcon();
};
