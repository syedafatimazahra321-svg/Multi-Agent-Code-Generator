/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        cyan: '#06B6D4',
        surface: '#161616',
        dark: '#0D0D0D',
      }
    },
  },
  plugins: [],
}