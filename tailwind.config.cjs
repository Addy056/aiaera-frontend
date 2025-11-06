/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0a0c10",
          850: "#0e1117",
          800: "#121622",
          700: "#1a2030",
        },
        text: {
          DEFAULT: "#eef2f7",
          soft: "#c8d0da",
          dim: "#9aa6b2",
        },
        accent: {
          aqua: "#00f5ff",
          aquaSoft: "rgba(0,245,255,0.12)",
          purple: "#7f5af0",
          purpleSoft: "rgba(127,90,240,0.12)",
        },
        glass: {
          border: "rgba(255,255,255,0.12)",
          bg: "rgba(16, 20, 31, 0.65)",
        },
      },
      boxShadow: {
        glass: "0 8px 30px rgba(0,0,0,0.45)",
        depth: "0 40px 120px rgba(0,0,0,0.55)",
        neonAqua: "0 0 18px rgba(0,245,255,0.55)",
        neonPurple: "0 0 18px rgba(127,90,240,0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
    },
  },
  plugins: [],
};
