/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'dark-yellow': '#d4a373',
        'dark-yellow-dark': '#b88a5e',
        'pastel-yellow': '#f9e3b3',
        'pastel-blue': '#b5d6e0',
        'cream': '#fefcf7',
        'warm-white': '#fcf3e8',
        'charcoal': '#2c2a29',
        
        // Additional accent colors
        'amber-light': '#fbbf24',
        'amber-dark': '#d97706',
        'orange-light': '#fb923c',
        'orange-dark': '#ea580c',
        'green-light': '#34d399',
        'green-dark': '#059669',
        'blue-light': '#60a5fa',
        'blue-dark': '#2563eb',
        'purple-light': '#a78bfa',
        'purple-dark': '#7c3aed',
        'pink-light': '#f472b6',
        'pink-dark': '#db2777',
        
        // Status colors
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'slide-out': 'slideOut 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-in',
        'scale-in': 'scaleIn 0.4s ease-out',
        'scale-out': 'scaleOut 0.4s ease-in',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'pulse-fast': 'pulseSoft 1s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'breathe-in': 'breatheIn 4s ease-in-out infinite',
        'breathe-out': 'breatheOut 8s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-30px)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        breatheIn: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
        breatheOut: {
          '0%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #d4a373, #b88a5e)',
        'gradient-warm': 'linear-gradient(135deg, #f9e3b3, #fefcf7)',
        'gradient-cool': 'linear-gradient(135deg, #b5d6e0, #fefcf7)',
        'gradient-amber': 'linear-gradient(135deg, #fbbf24, #d97706)',
        'gradient-orange': 'linear-gradient(135deg, #fb923c, #ea580c)',
        'gradient-green': 'linear-gradient(135deg, #34d399, #059669)',
        'gradient-blue': 'linear-gradient(135deg, #60a5fa, #2563eb)',
        'gradient-purple': 'linear-gradient(135deg, #a78bfa, #7c3aed)',
        'gradient-pink': 'linear-gradient(135deg, #f472b6, #db2777)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-hover': '0 12px 48px rgba(0, 0, 0, 0.12)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.10)',
        'brand': '0 8px 24px rgba(212, 163, 115, 0.3)',
        'brand-lg': '0 12px 48px rgba(212, 163, 115, 0.4)',
        'inner-glow': 'inset 0 2px 4px rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '28rem',
        '120': '30rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      blur: {
        'xs': '2px',
      },
      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}