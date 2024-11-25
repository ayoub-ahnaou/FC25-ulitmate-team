/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  blocklist: ["container"],
  theme: {
    extend: {
      colors: {
        greenColor: "#0B3D0B",
        darkGray: "#3B3B3B",
        softGray: "#f5f5f5",
        goldColor: "#B8860B",
        mainBlack: "#1A1A1A",
      },
      fontFamily: {
        gaMaamli: ["Ga Maamli", "sans-serif"],
        russoOne: ["Russo One", "sans-serif"],
      }
    },
  },
  plugins: [],
}