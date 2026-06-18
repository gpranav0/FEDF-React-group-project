/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // indigo-600
        secondary: '#10b981', // emerald-500
        background: '#f8fafc', // slate-50
        surface: '#ffffff',
      }
    },
  },
  plugins: [],
}
