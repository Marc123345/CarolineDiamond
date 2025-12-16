/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
        'Color-Primary-Beige': '#F7E6D7', // Primary brand color - warm beige
        'Color-Champagne-Gold': '#CDBCAB', // Secondary brand color - champagne gold
        'Color-Light-300': '#CDBCAB', // Accent color (champagne gold)
        'Color-Dark-500': '#000000', // Pure black text
        'Color-Netural-White': '#FFFFFF', // Pure white
        'Color-Netural-Black': '#000000', // Pure black
        'Color-Secondary': '#F7E6D7', // Primary beige background

        // Surface Colors - Improved Contrast System
        'surface': {
          DEFAULT: '#FDFBF7', // Warm off-white for primary surfaces
          elevated: '#FFFFFF', // Pure white for elevated elements
          subtle: '#F9F6F2', // Subtle warm background
        },

        // Simplified scale - only black/white/beige
        primary: {
          50: '#FFFFFF',   // White
          100: '#F7E6D7',  // Lightest beige
          400: '#CDBCAB',  // Champagne gold
          500: '#CDBCAB',  // Champagne gold
          600: '#CDBCAB',  // Champagne gold
          800: '#000000',  // Black
          900: '#000000',  // Black
        },
        secondary: {
          400: '#F7E6D7', // Primary beige
          500: '#CDBCAB', // Champagne gold
          600: '#CDBCAB', // Champagne gold
        },
        accent: {
          400: '#F7E6D7', // Primary beige
          500: '#CDBCAB', // Champagne gold
          600: '#CDBCAB', // Champagne gold
        },
      },

      // Spacing system (matches your CSS tokens)
      spacing: {
        // Tailwind keeps its own numeric scale; these are additive tokens
        'spacing-xs': '4px',
        'spacing-sm': '8px',
        'spacing-md': '16px',
        'spacing-lg': '24px',
        'spacing-xl': '32px',
        'spacing-2xl': '48px',
        'spacing-3xl': '64px',

        // Your previous custom sizes are kept too
        '18': '4.5rem',
        '34': '8.5rem',
        '88': '22rem',
        '128': '32rem',
        '112': '28rem',
        '144': '36rem',
      },

      // Consistent border radius system
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
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],   // luxury headings
        'serif-body': ['Cormorant Garamond', 'Verdana', 'sans-serif'],     // body copy
        'serif-italic': ['Cormorant Garamond', 'Georgia', 'serif'],   // taglines & quotes
      },

      fontSize: {
        // Luxury Headlines (Playfair Display)
        h1: ['clamp(4rem, 8vw, 5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h2: ['clamp(3rem, 6vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h3: ['clamp(2rem, 4vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '0em' }],
        
        // Subheadings & Taglines (Cormorant Garamond Italic)
        title: ['clamp(1.125rem, 2.5vw, 1.5rem)', { lineHeight: '1.4', fontStyle: 'italic' }],
        
        // Body Copy (Cormorant Garamond)
        'body-xl': ['18px', { 
          lineHeight: '28px', 
          letterSpacing: '-0.5px',
          fontWeight: '400',
          textAlign: 'center',
          wordBreak: 'keep-all'
        }],
        'body-lg': ['17px', { 
          lineHeight: '26px', 
          letterSpacing: '-0.5px',
          fontWeight: '400',
          textAlign: 'center',
          wordBreak: 'keep-all'
        }],
        body: ['16px', { 
          lineHeight: '24px', 
          letterSpacing: '-0.5px',
          fontWeight: '400',
          textAlign: 'center',
          wordBreak: 'keep-all'
        }],
        caption: ['14px', { 
          lineHeight: '20px', 
          letterSpacing: '-0.5px',
          fontWeight: '400',
          textAlign: 'center',
          wordBreak: 'keep-all'
        }],
        small: ['clamp(0.625rem, 1.5vw, 0.75rem)', { lineHeight: '1.4' }],
        
        // Numbers & Prices (Cormorant Garamond with spacing)
        price: ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'price-large': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '0.02em' }],
      },

      fontWeight: {
        light: '300',   // Luxury headings
        normal: '400',  // Body copy
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

      // ✨ Animations
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
          '50%': {
            boxShadow: '0 0 40px rgba(205,188,171,0.6), 0 0 60px rgba(205,188,171,0.3)',
          },
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
        // Mobile scrollbar hiding
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none',
        },

        /* Prevent horizontal overflow */
        '.prevent-overflow': {
          'max-width': '100%',
          'overflow-x': 'hidden',
          'width': '100%',
          'box-sizing': 'border-box',
        },

        /* Touch target utilities */
        '.touch-target': {
          'min-width': '44px',
          'min-height': '44px',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },

        '@screen sm': {
          '.touch-target': {
            'min-width': 'auto',
            'min-height': 'auto',
          },
        },

        /* Mobile-safe containers */
        '.mobile-safe': {
          'width': '100%',
          'max-width': '100%',
          'overflow-x': 'hidden',
          'box-sizing': 'border-box',
        },

        /* Fixed element safety */
        '.fixed-safe': {
          'max-width': '100vw',
          'width': '100%',
          'box-sizing': 'border-box',
        },

        /* Responsive spacing utilities */
        '.section-padding': {
          'padding-top': '2rem',
          'padding-bottom': '2rem',
        },
        '@screen sm': {
          '.section-padding': {
            'padding-top': '3rem',
            'padding-bottom': '3rem',
          },
        },
        '@screen md': {
          '.section-padding': {
            'padding-top': '4rem',
            'padding-bottom': '4rem',
          },
        },
        '@screen lg': {
          '.section-padding': {
            'padding-top': '6rem',
            'padding-bottom': '6rem',
          },
        },
        '@screen xl': {
          '.section-padding': {
            'padding-top': '8rem',
            'padding-bottom': '8rem',
          },
        },

        /* Spacing Utilities */
        '.space-xs': { margin: '4px' },
        '.space-sm': { margin: '8px' },
        '.space-md': { margin: '16px' },
        '.space-lg': { margin: '24px' },
        '.space-xl': { margin: '32px' },
        '.space-2xl': { margin: '48px' },
        '.space-3xl': { margin: '64px' },

        /* Padding Utilities */
        '.p-xs': { padding: '4px' },
        '.p-sm': { padding: '8px' },
        '.p-md': { padding: '16px' },
        '.p-lg': { padding: '24px' },
        '.p-xl': { padding: '32px' },
        '.p-2xl': { padding: '48px' },
        '.p-3xl': { padding: '64px' },

        /* Typography Utilities */
        '.text-balance': { 'text-wrap': 'balance' },
        '.text-pretty': { 'text-wrap': 'pretty' },

        /* Layout Utilities */
        '.full-bleed': {
          width: '100vw',
          'margin-left': 'calc(50% - 50vw)',
        },

        /* Animation Utilities */
        '.animate-on-scroll': {
          opacity: '0',
          transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        },
        '.animate-on-scroll.in-view': {
          opacity: '1',
          transform: 'translateY(0)',
        },

        /* Glass Effect */
        '.glass': {
          background: 'rgba(248, 248, 248, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(205, 188, 171, 0.2)',
        },

        /* Luxury Gradient */
        '.luxury-gradient': {
          background: 'linear-gradient(135deg, #CDBCAB 0%, #B9A892 100%)',
        },

        /* Premium Shadow */
        '.premium-shadow': {
          'box-shadow': '0 20px 40px rgba(6, 3, 10, 0.1), 0 10px 20px rgba(6, 3, 10, 0.05)',
        },

        /* Elegant Border */
        '.elegant-border': {
          border: '1px solid rgba(205, 188, 171, 0.3)',
          position: 'relative',
        },
        '.elegant-border::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'linear-gradient(45deg, transparent, rgba(205, 188, 171, 0.1), transparent)',
          'pointer-events': 'none',
        },

        /* Text Breaking Utilities */
        '.overflow-wrap-anywhere': {
          'overflow-wrap': 'anywhere',
          'word-break': 'break-word',
          'hyphens': 'auto',
        },
        '.text-wrap-balance': {
          'text-wrap': 'balance',
        },
        '.text-wrap-pretty': {
          'text-wrap': 'pretty',
        },
      });
    },
  ],
};