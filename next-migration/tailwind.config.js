/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
    },
    extend: {
      colors: {
        // Minimalist Brand Palette - Diamonds by CS (Black, White, Beige only)
        'Color-Primary-Beige': '#F7E6D7',
        'Color-Champagne-Gold': '#CDBCAB',
        'Color-Light-300': '#CDBCAB',
        'Color-Dark-500': '#000000',
        'Color-Netural-White': '#FFFFFF',
        'Color-Netural-Black': '#000000',
        'Color-Secondary': '#F7E6D7',

        // Surface Colors - Improved Contrast System
        'surface': {
          DEFAULT: '#FDFBF7',
          elevated: '#FFFFFF',
          subtle: '#F9F6F2',
        },

        // Simplified scale - only black/white/beige
        primary: {
          50: '#FFFFFF',
          100: '#F7E6D7',
          400: '#CDBCAB',
          500: '#CDBCAB',
          600: '#CDBCAB',
          800: '#000000',
          900: '#000000',
        },
        secondary: {
          400: '#F7E6D7',
          500: '#CDBCAB',
          600: '#CDBCAB',
        },
        accent: {
          400: '#F7E6D7',
          500: '#CDBCAB',
          600: '#CDBCAB',
        },
      },

      spacing: {
        'spacing-xs': '4px',
        'spacing-sm': '8px',
        'spacing-md': '16px',
        'spacing-lg': '24px',
        'spacing-xl': '32px',
        'spacing-2xl': '48px',
        'spacing-3xl': '64px',
        '18': '4.5rem',
        '34': '8.5rem',
        '88': '22rem',
        '128': '32rem',
        '112': '28rem',
        '144': '36rem',
      },

      borderRadius: {
        DEFAULT: '0.5rem',
        none: '0',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
      },

      zIndex: {
        base: '0',
        decoration: '10',
        content: '20',
        navigation: '30',
        header: '40',
        overlay: '50',
        modal: '60',
        tooltip: '70',
      },

      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        'serif-body': ['Cormorant Garamond', 'Verdana', 'sans-serif'],
        'serif-italic': ['Cormorant Garamond', 'Georgia', 'serif'],
      },

      fontSize: {
        h1: ['clamp(4rem, 8vw, 5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h2: ['clamp(3rem, 6vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h3: ['clamp(2rem, 4vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '0em' }],
        title: ['clamp(1.125rem, 2.5vw, 1.5rem)', { lineHeight: '1.4', fontStyle: 'italic' }],
        'body-xl': ['18px', { lineHeight: '28px', letterSpacing: '-0.5px', fontWeight: '400' }],
        'body-lg': ['17px', { lineHeight: '26px', letterSpacing: '-0.5px', fontWeight: '400' }],
        body: ['16px', { lineHeight: '24px', letterSpacing: '-0.5px', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '20px', letterSpacing: '-0.5px', fontWeight: '400' }],
        small: ['clamp(0.625rem, 1.5vw, 0.75rem)', { lineHeight: '1.4' }],
        price: ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'price-large': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '0.02em' }],
      },

      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      letterSpacing: {
        'luxury-tight': '-0.02em',
        'luxury-normal': '0em',
        'luxury-wide': '0.02em',
        'luxury-wider': '0.05em',
      },

      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'stagger-fade': 'staggerFade 0.8s ease-out',
        'underline-expand': 'underline-expand 0.6s ease forwards',
        'diamond-sparkle': 'diamond-sparkle 3s infinite ease-in-out',
        'gentle-glow': 'gentle-glow 3s infinite ease-in-out',
        'spring-in': 'spring-in 0.6s ease-out',
        'float-in': 'float-in 0.8s ease-out',
        'slide-up': 'slide-up 0.8s ease-out',
        'fade-scale': 'fade-scale 0.6s ease-out',
        'smooth-bounce': 'smooth-bounce 2s infinite ease-in-out',
        'elegant-rise': 'elegant-rise 1s ease-out',
        'luxury-glow': 'luxury-glow 3s infinite ease-in-out',
        'premium-pulse': 'premium-pulse 2s infinite ease-in-out',
        'silk-flow': 'silk-flow 4s linear infinite',
        'backdrop-glow': 'backdrop-glow 6s infinite ease-in-out',
        'luxury-float': 'luxury-float 6s ease-in-out infinite',
        'premium-shimmer': 'premium-shimmer 3s ease-in-out infinite',
        'elegant-pulse': 'elegant-pulse 4s ease-in-out infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        staggerFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'underline-expand': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'diamond-sparkle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        'gentle-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(205,188,171,0.3)' },
          '50%': { boxShadow: '0 0 15px rgba(205,188,171,0.6)' },
        },
        'spring-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '50%': { transform: 'translateY(-2px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'float-in': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-scale': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'smooth-bounce': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'elegant-rise': {
          '0%': { opacity: '0', transform: 'translateY(60px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'luxury-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(205,188,171,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(205,188,171,0.6), 0 0 60px rgba(205,188,171,0.3)' },
        },
        'premium-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'silk-flow': {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
        'backdrop-glow': {
          '0%, 100%': { backdropFilter: 'blur(20px) brightness(1)' },
          '50%': { backdropFilter: 'blur(25px) brightness(1.1)' },
        },
        'luxury-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-0.5deg)' },
        },
        'premium-shimmer': {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)', opacity: '0' },
        },
        'elegant-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(205,188,171,0.3), 0 0 40px rgba(205,188,171,0.1)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(205,188,171,0.5), 0 0 60px rgba(205,188,171,0.2)',
            transform: 'scale(1.02)'
          },
        },
      },

      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none',
        },
        '.prevent-overflow': {
          'max-width': '100%',
          'overflow-x': 'hidden',
          'width': '100%',
          'box-sizing': 'border-box',
        },
        '.touch-target': {
          'min-width': '44px',
          'min-height': '44px',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.mobile-safe': {
          'width': '100%',
          'max-width': '100%',
          'overflow-x': 'hidden',
          'box-sizing': 'border-box',
        },
        '.fixed-safe': {
          'max-width': '100vw',
          'width': '100%',
          'box-sizing': 'border-box',
        },
      });
    },
  ],
};
