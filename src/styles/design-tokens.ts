/**
 * Design Tokens - Centralized design system constants
 * Use these tokens instead of hardcoded values for consistency
 */

export const colors = {
  // Brand Colors
  primary: {
    beige: '#F7E6D7',
    champagneGold: '#CDBCAB',
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
  },

  // Surface Colors
  surface: {
    default: '#FDFBF7',
    elevated: '#FFFFFF',
    subtle: '#F9F6F2',
  },

  // State Colors
  state: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#CDBCAB',
    muted: '#6B7280',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

export const fontSize = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px - Body text
  base: '1rem',       // 16px - Standard body
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
} as const;

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typography = {
  // Font families
  fontFamily: {
    sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
    display: '"Playfair Display", Georgia, serif',
  },
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    luxury: '0.15em',    // For uppercase luxury text
  },
  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
    luxury: 1.8,
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  luxury: {
    soft: '0 8px 40px rgba(205,188,171,0.08)',
    medium: '0 12px 48px rgba(205,188,171,0.12)',
    prominent: '0 20px 60px rgba(205,188,171,0.18)',
  },
} as const;

export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

export const zIndex = {
  base: 0,
  decoration: 10,
  content: 20,
  navigation: 30,
  header: 40,
  overlay: 50,
  modal: 60,
  tooltip: 70,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Tailwind class helpers
export const tw = {
  // Brand colors
  bgPrimary: 'bg-Color-Primary-Beige',
  bgChampagne: 'bg-Color-Champagne-Gold',
  bgWhite: 'bg-Color-Netural-White',
  bgBlack: 'bg-Color-Netural-Black',

  textPrimary: 'text-Color-Netural-Black',
  textSecondary: 'text-Color-Champagne-Gold',
  textWhite: 'text-Color-Netural-White',

  borderPrimary: 'border-Color-Primary-Beige',
  borderChampagne: 'border-Color-Champagne-Gold',

  // Common patterns
  card: 'bg-white rounded-xl border border-Color-Primary-Beige shadow-sm',
  cardHover: 'hover:shadow-md hover:-translate-y-1 transition-all duration-300',
  input: 'w-full px-4 py-3 border-2 border-Color-Light-300 rounded-xl focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-Color-Champagne-Gold transition-all duration-300 bg-white hover:border-Color-Champagne-Gold outline-none min-h-[44px]',
  button: {
    primary: 'bg-Color-Netural-Black text-Color-Netural-White hover:bg-Color-Netural-Black/90 transition-all duration-300',
    secondary: 'border-2 border-Color-Netural-Black text-Color-Netural-Black hover:bg-Color-Netural-Black hover:text-Color-Netural-White transition-all duration-300',
  },
} as const;
