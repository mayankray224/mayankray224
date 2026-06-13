import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F4A426", // Warm golden orange
          dark: "#D98616",
        },
        secondary: {
          DEFAULT: "#7DB99A", // Sage green
          dark: "#5E9B7C",
        },
        accent: {
          DEFAULT: "#E8A598", // Soft terracotta
          dark: "#CE8B7E",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        warm: {
          bg: "#FDF8F2",
          card: "#FFFDFB",
          border: "#F5E6D3",
        },
        dark: {
          bg: "#1A1A2E",
          card: "#252538",
          border: "#32324D",
        }
      },
      fontFamily: {
        hind: ["Hind", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
