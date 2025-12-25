import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        // Animation for desktop and larger screens: starts halfway visible and scrolls out to the left
        marqueeDesktop: {
          '0%': { transform: 'translateX(55%)' },
          '100%': { transform: 'translateX(-95%)' },
        },
        // Animation for mobile screens: start fully off‑screen to the right and scroll to the left
        marqueeMobile: {
          '0%': { transform: 'translateX(80%)' },
          '100%': { transform: 'translateX(-95%)' },
        },
      },
      animation: {
        // Base animations used in components. We define separate names so we can apply them responsively.
        marqueeDesktop: 'marqueeDesktop 8s linear infinite',
        marqueeMobile: 'marqueeMobile 8s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
