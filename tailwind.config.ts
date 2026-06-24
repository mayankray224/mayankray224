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
        },
        // Portfolio Specific Color System
        portfolio: {
          bg: "#06070A",
          bgSec: "#10131A",
          card: "#151A23",
          gold: "#D4AF37",
          purple: "#8B5CF6",
          blue: "#60A5FA",
          text: "#FFFFFF",
          textSec: "#A0AEC0",
          success: "#10B981",
          warning: "#F59E0B",
        }
      },
      fontFamily: {
        hind: ["Hind", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
        cormorant: ["'Cormorant Garamond'", "serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
