const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages/*.{js,ts,jsx,tsx}",
    "./shared/components/**/*.{js,ts,jsx,tsx}",
    "./shared/layout/*.{js,ts,jsx,tsx}",
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages/*.{js,ts,jsx,tsx}",
    "./shared/components/**/*.{js,ts,jsx,tsx}",
    "./shared/layout/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    minWidth: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
    },
    fontFamily: {
      sans: ['"PT Sans"', "sans-serif"],
      montserrat: ["montserrat", "sans-serif"],
    },
    colors: {
      ...colors,
      one: "#fff",
      two: "#000",
      three: "#e66922",
      four: "#000",

      grey: "#999999",
      lightgrey: "#000029",
      darkgrey: "#595959",
      darkergrey: "#292929",
      orange_custom: "#FA7B1F",
      //orange_custom: {
      //400: "#E66922",
      //600: "#9e3d05",
      //},
      purple: {
        400: "#65173E",
        600: "#470f2b",
        800: "#380c22",
      },
    },
  },
  plugins: [],
};
