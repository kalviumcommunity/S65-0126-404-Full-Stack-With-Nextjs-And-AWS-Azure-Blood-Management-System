
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable class-based dark mode — toggled by adding 'dark' to <html>
  darkMode: 'class',

  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/context/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
  ],

  theme: {
    // ─── Custom Breakpoints (Mobile-First) ──────────────────────────────────
    screens: {
      sm: '480px',   // Large phones
      md: '768px',   // Tablets
      lg: '1024px',  // Laptops
      xl: '1280px',  // Desktops
      '2xl': '1536px', // Wide screens
    },

    extend: {
      // ─── Brand Color Palette (Design Tokens) ──────────────────────────────
      colors: {
        brand: {
          50:  '#fff5f5',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Primary brand red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Semantic tokens
        success: '#16a34a',
        warning: '#d97706',
        danger:  '#dc2626',
        info:    '#2563eb',
      },

      // ─── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },

      // ─── Smooth Theme Transition ───────────────────────────────────────────
      transitionProperty: {
        theme: 'background-color, color, border-color',
      },

      // ─── Animations ─────────────────────────────────────────────────────────
      keyframes: {
        spin: { '100%': { transform: 'rotate(360deg)' } },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        spin: 'spin 1s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
      },
    },
  },

  plugins: [],
};
