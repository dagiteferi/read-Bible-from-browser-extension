/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./fullverse.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode
        'bg-cream': '#F9F3E7',
        'indigo-deep': '#1E3A5F',
        'amber-warm': '#C97C3D',
        'olive-mountain': '#5F6D5A',
        'burgundy-curtain': '#722F37',
        'text-primary': '#2C2C2C',
        'text-secondary': '#5C5C5C',
        'border-light': '#E8E0D5',

        // Dark Mode
        'dark-bg': '#2C2C2C',
        'dark-surface': '#3C3C3C',
        'dark-text': '#F0F0F0',
        'dark-text-secondary': '#B0B0B0',
        'dark-border': '#4C4C4C',

        // Accents (same in dark mode but adjusted)
        'dark-indigo': '#2A4A70',
        'dark-amber': '#D88C4A',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        ethiopic: ['Noto Sans Ethiopic', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}