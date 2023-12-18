/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        main:{
          800:"#86198f"
        },
        hover:{
          50:"#fdf4ff",
          600:"#c026d3"
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
