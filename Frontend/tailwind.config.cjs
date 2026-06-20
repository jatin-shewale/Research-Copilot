/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#6366F1',
          50: '#EEF0FF',
          100: '#E0E3FF',
          200: '#C6CBFF',
          300: '#A5ACFF',
          400: '#8388FB',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#372FA3',
          900: '#2E2A80',
        },
        secondary: '#60A5FA',
        accent: '#A78BFA',
        text: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        soft: '0 4px 6px -1px rgb(15 23 42 / 0.06), 0 2px 4px -2px rgb(15 23 42 / 0.05)',
        lift: '0 12px 24px -8px rgb(99 102 241 / 0.18), 0 4px 8px -4px rgb(15 23 42 / 0.08)',
        glow: '0 0 0 1px rgb(99 102 241 / 0.08), 0 8px 30px -8px rgb(99 102 241 / 0.35)',
      },
      borderRadius: {
        lg: '0.625rem',
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      backgroundImage: {
        'grid-slate': 'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
        'hero-gradient': 'radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.14) 0%, rgba(167,139,250,0.08) 45%, rgba(248,250,252,0) 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
