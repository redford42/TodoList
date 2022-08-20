/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}","./js/base.js"],
  theme: {
    extend: {
      colors:{
        "primary":"#00484b",
        "primary-dark":"#003133",
        "primary-light":"#007b80"
      }
    },
  },
  plugins: [],
}
