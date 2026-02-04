/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
          light: '#C8E6C9',
        },
        secondary: {
          DEFAULT: '#FF9800',
          dark: '#F57C00',
        },
        brand: {
          orange: '#F97316',
          green: '#34C759',
          bg: '#F5F5F7',
        },
      },
    },
  },
  plugins: [],
};
