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
          50: '#f5f8ff',
          100: '#ebf1ff',
          200: '#d6e4ff',
          300: '#adc8ff',
          400: '#85a9ff',
          550: '#3366ff',
          600: '#2952d9',
          700: '#1f3cb3',
          800: '#14278c',
          900: '#0a1466',
        }
      }
    },
  },
  plugins: [],
}
