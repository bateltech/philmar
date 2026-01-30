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

      /* =========================
         KEYFRAMES
      ========================= */
      keyframes: {
        /* EXISTANT (inchangé) */
        marqueeDesktop: {
          '0%': { transform: 'translateX(55%)' },
          '100%': { transform: 'translateX(-95%)' },
        },
        // Animation for mobile screens: start fully off‑screen to the right and scroll to the left
        marqueeMobile: {
          '0%': { transform: 'translateX(80%)' },
          '100%': { transform: 'translateX(-95%)' },
        },

        /* NOUVEAUX SLIDE IN */
        slideInFromLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInFromRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInFromTop: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInFromBottom: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },

      /* =========================
         ANIMATIONS
      ========================= */
      animation: {
        /* EXISTANT (inchangé) */
        marqueeDesktop: 'marqueeDesktop 8s linear infinite',
        marqueeMobile: 'marqueeMobile 8s linear infinite',

        /* NOUVELLES ANIMATIONS */
        slideInFromLeft: 'slideInFromLeft 0.6s ease-out forwards',
        slideInFromRight: 'slideInFromRight 0.6s ease-out forwards',
        slideInFromTop: 'slideInFromTop 0.6s ease-out forwards',
        slideInFromBottom: 'slideInFromBottom 0.6s ease-out forwards',
        fadeIn: 'fadeIn 0.3s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
