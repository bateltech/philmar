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
       // Add custom keyframes for the slide-in animation
       keyframes: {
        slideInFromRight: {
          "0%": { transform: "translateX(10%)", opacity: "0" }, // Start closer
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-10%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-20%)", opacity: "0" }, // Start closer
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInFromBottom: {
          "0%": { transform: "translateY(20%)", opacity: "0" }, // Start closer
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      // Add custom animations
      animation: {
        slideInFromLeft: "slideInFromLeft 2s ease-in-out forwards", // Smoother easing
        slideInFromRight: "slideInFromRight 2s ease-in-out forwards",
        slideInFromTop: "slideInFromTop 2s ease-out forwards",
        slideInFromBottom: "slideInFromBottom 2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
