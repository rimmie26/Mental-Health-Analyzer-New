/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-yellow': '#d4a373',
        'dark-yellow-dark': '#b88a5e',
        'pastel-yellow': '#f9e3b3',
        'pastel-blue': '#b5d6e0',
        'cream': '#fefcf7',
        'warm-white': '#fcf3e8',
        'charcoal': '#2c2a29',
      },
    },
  },
  plugins: [],
}