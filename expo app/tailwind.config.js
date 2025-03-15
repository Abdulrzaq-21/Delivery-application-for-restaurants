/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          snow: {
            DEFAULT: "#FFFAFA",
            50: "#FFFFFF",
            100: "#FFFAFA",
            200: "#F2EDED",
            300: "#E6E0E0",
            400: "#D9D3D3",
            500: "#CCC6C6",
            600: "#BFB9B9",
            700: "#B3ADAD",
            800: "#A69F9F",
            900: "#999292"
          },
          madder: {
            DEFAULT: "#A31621",
            50: "#FCE6E9",
            100: "#F7C2C8",
            200: "#F29AA1",
            300: "#EC717A",
            400: "#E74852",
            500: "#A31621",
            600: "#8D121C",
            700: "#770F17",
            800: "#620B12",
            900: "#4C080D"
          }
        },
        fontFamily: {
          markazi: "markazi",
          Mmedium: "Mmedium",
          Mregular: "Mregular",
          Msemibold: "Msemibold",
          Mbold: "Mbold",
        },
      },
    },
    plugins: [],
  }