// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#1e1325",
          dark: "#2c1a38",
          gradientStart: "#2a1a3d", // Rich deep purple
          gradientEnd: "#22102c", // Slightly darker purple
        },
        chat: {
          user: "#4d2a6d",
          assistant: "#7d3c58",
        },
        text: {
          DEFAULT: "#e8daef",
          light: "#fde7ef",
          muted: "#c9a4c5",
        },
        button: {
          DEFAULT: "#955678",
          hover: "#a06585",
        },
        input: {
          DEFAULT: "#3a214a",
        },
      },
      boxShadow: {
        subtle: "0px 2px 10px rgba(0, 0, 0, 0.15)",
        stronger: "0px 6px 18px rgba(0, 0, 0, 0.35)", // More pronounced shadow
      },
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
      fontSize: {
        xl: "22px",
      },
      spacing: {
        chatPadding: "1.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;