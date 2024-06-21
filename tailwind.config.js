/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:
      {
        raisin:
        {
          DEFAULT:'#001430'
        },

        peach:{
          DEFAULT:'#F5C287'
        },
        hex:{
          DEFAULT:'#72868A'
        }
      }
    },
  },
  plugins: [],
}