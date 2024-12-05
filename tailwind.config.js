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

        veryPoor: "#A9A9A9", // 0 - 20
        poor: "#FF6347", // 21 - 40
        average: "#FFD700", // 41 - 60
        aboveAverage: "#FFA500", // 61 - 80
        good: "#32CD32", // 81 - 90
        excellent: "#05ffde", // 91 - 100 
      },
      fontFamily: {
        gaMaamli: ["Ga Maamli", "sans-serif"],
        russoOne: ["Russo One", "sans-serif"],
      }
    },
  },
  plugins: [],
  darkMode: "class",
}