/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        "primary-hover": "#6D28D9",

        secondary: "#8B5CF6",
        accent: "#A855F7",

        background: "#F8FAFC",
        surface: "#FFFFFF",

        border: "#E2E8F0",

        heading: "#0F172A",
        body: "#475569",
        muted: "#94A3B8",

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",

        sidebar: "#FFFFFF",
        card: "#FFFFFF",
      },

      fontFamily: {
        sans: [
          "Inter",
          "sans-serif",
        ],
      },

      borderRadius: {
        xs: "6px",
        sm: "10px",
        DEFAULT: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "28px",
        "3xl": "32px",
        "4xl": "40px",
      },

      boxShadow: {
        xs: "0 1px 2px rgba(15,23,42,0.04)",

        sm: "0 2px 6px rgba(15,23,42,0.06)",

        DEFAULT:
          "0 8px 24px rgba(15,23,42,0.06)",

        md:
          "0 12px 32px rgba(15,23,42,0.08)",

        lg:
          "0 20px 48px rgba(15,23,42,0.10)",

        xl:
          "0 28px 60px rgba(15,23,42,0.12)",

        glow:
          "0 0 0 4px rgba(124,58,237,0.10)",

        card:
          "0 10px 35px rgba(15,23,42,0.08)",

        floating:
          "0 24px 60px rgba(15,23,42,0.12)",
      },

      fontSize: {
        xs: [
          "0.75rem",
          {
            lineHeight: "1rem",
          },
        ],

        sm: [
          "0.875rem",
          {
            lineHeight: "1.25rem",
          },
        ],

        base: [
          "1rem",
          {
            lineHeight: "1.6rem",
          },
        ],

        lg: [
          "1.125rem",
          {
            lineHeight: "1.75rem",
          },
        ],

        xl: [
          "1.25rem",
          {
            lineHeight: "1.8rem",
          },
        ],

        "2xl": [
          "1.5rem",
          {
            lineHeight: "2rem",
          },
        ],

        "3xl": [
          "1.875rem",
          {
            lineHeight: "2.3rem",
          },
        ],

        "4xl": [
          "2.25rem",
          {
            lineHeight: "2.6rem",
          },
        ],

        "5xl": [
          "3rem",
          {
            lineHeight: "1.1",
          },
        ],

        "6xl": [
          "3.75rem",
          {
            lineHeight: "1",
          },
        ],
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(.4,0,.2,1)",
      },

      transitionDuration: {
        250: "250ms",
        350: "350ms",
        450: "450ms",
      },

      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },

        fadeUp: {
          "0%": {
            opacity: "0",
            transform:
              "translateY(18px)",
          },
          "100%": {
            opacity: "1",
            transform:
              "translateY(0)",
          },
        },

        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(.96)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },

        float: {
          "0%,100%": {
            transform:
              "translateY(0px)",
          },
          "50%": {
            transform:
              "translateY(-8px)",
          },
        },

        pulseGlow: {
          "0%,100%": {
            boxShadow:
              "0 0 0 rgba(124,58,237,0)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(124,58,237,.18)",
          },
        },
      },

      animation: {
        fade: "fadeIn .4s ease",

        "fade-up":
          "fadeUp .5s ease",

        "scale-in":
          "scaleIn .35s ease",

        float:
          "float 6s ease-in-out infinite",

        glow:
          "pulseGlow 3s ease-in-out infinite",
      },

      backdropBlur: {
        xs: "2px",
        glass: "18px",
      },

      maxWidth: {
        dashboard: "1440px",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },
    },
  },

  plugins: [],
};