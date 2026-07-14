import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "rgb(var(--brand-ink) / <alpha-value>)",
          paper: "rgb(var(--brand-paper) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          card: "rgb(var(--brand-card) / <alpha-value>)",
          line: "rgb(var(--brand-line) / <alpha-value>)",
          neon: "rgb(var(--brand-neon) / <alpha-value>)",
          cyan: "rgb(var(--brand-cyan) / <alpha-value>)",
          violet: "rgb(var(--brand-violet) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-neon": "0 0 24px rgb(var(--brand-neon) / 0.55), 0 0 60px rgb(var(--brand-neon) / 0.25)",
        "glow-cyan": "0 0 24px rgb(var(--brand-cyan) / 0.55), 0 0 60px rgb(var(--brand-cyan) / 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
