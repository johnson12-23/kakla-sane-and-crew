import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        emeraldDeep: "#0f3d2e",
        goldLux: "#d4af37",
        noir: "#0a0a0a",
        sand: "#f3e9d2"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 12px 40px rgba(212, 175, 55, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
