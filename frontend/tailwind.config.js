/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC143C',
        dark: '#1A1A1A',
        gold: '#FFD700',
      },
    },
  },
  plugins: [],
}