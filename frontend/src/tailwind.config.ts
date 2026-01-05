/** @type {import('tailwindcss').Config} */

const config: import("tailwindcss").Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "Noto Sans Khmer",
          "Khmer OS",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Segoe UI Mono",
        ],
        cursive: [
          "var(--font-cursive)",
          "cursive",
          "Noto Sans Khmer",
          "Khmer OS",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
