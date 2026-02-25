/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./fullverse.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Spiritual Palette - Light Mode
        'cream': {
          DEFAULT: '#F9F3E7',
          parchment: '#F9F3E7',
        },
        'indigo-prayer': {
          DEFAULT: '#1E3A5F',
          deep: '#1E3A5F',
        },
        'amber-spirit': {
          DEFAULT: '#C97C3D',
          warm: '#C97C3D',
        },
        'olive-mountain': {
          DEFAULT: '#5F6D5A',
        },
        'burgundy-curtain': {
          DEFAULT: '#722F37',
        },

        // UI Colors
        'text-primary': '#2C2C2C',
        'text-secondary': '#5C5C5C',
        'border-light': '#E8E0D5',

        // Dark Mode - Contemplative Night
        'night': {
          bg: '#2C2C2C',
          surface: '#3C3C3C',
          text: '#F0F0F0',
          'text-muted': '#B0B0B0',
          border: '#4C4C4C',
          indigo: '#2A4A70',
          amber: '#D88C4A',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        ethiopic: ['Noto Sans Ethiopic', 'Noto Sans', 'Nyala', 'Abyssinica SIL', 'sans-serif'],
      },
      boxShadow: {
        'sacred': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'sacred-hover': '0 6px 16px rgba(30, 58, 95, 0.1)',
        'amber-glow': '0 0 15px rgba(201, 124, 61, 0.3)',
      },
      borderRadius: {
        'sacred': '8px',
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      }
    },
  },
  plugins: [],
}