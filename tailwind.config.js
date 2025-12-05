/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Bai Jamjuree"', "sans-serif"],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      textColor: {
        primary: "#e1e3e3",
        subtext: "#5c5c5c",
      },
      borderColor: {
        primary: "#e1e3e3",
      },
      backgroundColor: {
        actived: "#c4ff48",
      },
      screens: {
        xs: "375px",
        mobile: "430px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1280px",
      },
      height: {
        "screen-dynamic": "calc(var(--vh, 1vh) * 100)",
      },
    },
  },
  plugins: [],
};
