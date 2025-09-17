/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E16A3D',
          light: '#FEA450',
          dark: '#D55A2D'
        },
        secondary: {
          DEFAULT: '#FEA450',
          light: '#FFB366',
          dark: '#E8943A'
        },
        accent: {
          DEFAULT: '#016A6D',
          light: '#028A8D',
          dark: '#014A4D'
        },
        dark: {
          DEFAULT: '#043E52',
          light: '#055A6B',
          dark: '#032A35'
        },
        light: {
          DEFAULT: '#FFF9F5',
          bg: '#FFF9F5'
        },
        success: '#22C55E',
        warning: '#FEA450',
        danger: '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.1)',
        'medium': '0 4px 20px rgba(0,0,0,0.15)',
        'strong': '0 8px 32px rgba(0,0,0,0.2)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      }
    },
  },
  plugins: [],
}