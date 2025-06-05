/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eef4ff',
          100: '#dbe8ff',
          200: '#bfd4ff',
          300: '#93b7fe',
          400: '#608ffb',
          500: '#3563e9', // Primary blue
          600: '#2552e2',
          700: '#1a3fce',
          800: '#1935a7',
          900: '#1a3384',
        },
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};