import { text } from "stream/consumers";
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
          DEFAULT: "var(--color-background)",
          dark: "var(--color-background-dark)",
          gradientStart: "var(--color-gradient-start)",
          gradientEnd: "var(--color-gradient-end)",
          text: "var(--color-text)",
        },
        chat: {
          user: "var(--color-chat-user)",
          assistant: "var(--color-chat-assistant)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          light: "var(--color-text-light)",
          muted: "var(--color-text-muted)",
        },
        button: {
          DEFAULT: "var(--color-button)",
          hover: "var(--color-button-hover)",
        },
        input: "var(--color-input)",
      },
      boxShadow: {
        subtle: "0px 2px 10px rgba(0, 0, 0, 0.15)",
        stronger: "0px 6px 18px rgba(0, 0, 0, 0.35)",
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
