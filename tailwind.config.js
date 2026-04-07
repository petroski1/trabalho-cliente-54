/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          50:  '#f3f4ee',
          100: '#e3e6d3',
          200: '#c8ccaa',
          300: '#a9b07e',
          400: '#8f965a',
          500: '#747c42',
          600: '#5a6133',
          700: '#464b28',
          800: '#363a20',
          900: '#2b2e1a',
        }
      }
    },
  },
  plugins: [],
}
