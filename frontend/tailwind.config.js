/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        'dark-yellow': '#d4a373',
        'dark-yellow-dark': '#b88a5e',
        'pastel-yellow': '#f9e3b3',
        'pastel-blue': '#b5d6e0',
        'cream': '#fefcf7',
        'warm-white': '#fcf3e8',
        'charcoal': '#2c2a29',
=======
        'buttery': {
          50: '#FFFDF5',
          100: '#FFF5D6',
          200: '#FFEAA7',
          300: '#FFDF78',
          400: '#FFD449',
          500: '#FFC920',
        },
        'pastel-blue': {
          50: '#F0F7FA',
          100: '#D4E6F1',
          200: '#B8D8E3',
          300: '#9CCAD5',
          400: '#80BCC7',
          500: '#64AEB9',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
>>>>>>> d8c8916d369307ad8403fcdfdff60fa3581a8186
      },
    },
  },
  plugins: [],
}