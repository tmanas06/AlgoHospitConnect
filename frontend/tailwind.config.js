/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a8d0ff',
        secondary: '#c7b8ff',
        background: {
          light: '#f7f9ff',
          dark: '#0f1222',
        },
        text: {
          light: '#0f1222',
          dark: '#f1f3ff',
        },
        card: {
          light: '#ffffff',
          dark: '#171a2e',
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
