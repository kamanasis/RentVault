/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#07111F',
          dark: '#07111F',
          light: '#0B1728',
        },
        card: {
          DEFAULT: '#0F1B2D',
          hover: '#14233A',
        },
        surface: {
          DEFAULT: '#16263D',
          hover: '#1E324F',
        },
        border: {
          DEFAULT: '#233554',
          subtle: '#1C2B45',
        },
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          glow: '#60A5FA',
        },
        success: {
          DEFAULT: '#10B981',
          bg: 'rgba(16, 185, 129, 0.1)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
        error: {
          DEFAULT: '#EF4444',
          bg: 'rgba(239, 68, 68, 0.1)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '16px',
        'xl': '12px',
      },
      boxShadow: {
        'stellar': '0 8px 32px 0 rgba(59, 130, 246, 0.12)',
        'stellar-glow': '0 0 25px 0 rgba(96, 165, 250, 0.25)',
        'card-glow': '0 10px 40px -10px rgba(7, 17, 31, 0.8), 0 0 20px 0 rgba(35, 53, 84, 0.4)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};
