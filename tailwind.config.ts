import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F1",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#16211D",
          soft: "#3A443F",
          muted: "#667169",
          faint: "#9AA39C",
        },
        line: "#E4E3DA",
        brand: {
          50: "#EAF2EF",
          100: "#CFE2DB",
          200: "#A3C7BA",
          300: "#71A794",
          400: "#3F8672",
          500: "#1F5F52",
          600: "#194C43",
          700: "#143C36",
          800: "#0F2E29",
          900: "#0A1F1C",
        },
        clay: {
          50: "#FBF0E7",
          100: "#F3D9C1",
          200: "#E7B686",
          300: "#D99652",
          400: "#C97B3B",
          500: "#AD6329",
          600: "#8C4F20",
        },
        alert: {
          50: "#FBEAE6",
          100: "#F2C6B9",
          400: "#C1462F",
          500: "#A83A26",
          600: "#872F1F",
        },
        sage: {
          50: "#EAF3EE",
          100: "#CBE3D5",
          400: "#4C8B6E",
          500: "#3B715A",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,33,29,0.04), 0 1px 8px rgba(22,33,29,0.04)",
        pop: "0 8px 30px rgba(22,33,29,0.12)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
