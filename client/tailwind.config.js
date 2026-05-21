/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./Components/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // Specify the font for "sans"
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
