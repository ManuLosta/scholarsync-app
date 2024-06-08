import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch', // add required value here
          },
        },
      },
    },
  },
  plugins: [nextui(), require('@tailwindcss/typography')],
  darkMode: 'class',
};
