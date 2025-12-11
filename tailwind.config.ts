import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b4ceff',
          300: '#82adff',
          400: '#4b86f5',
          500: '#2563EB',
          600: '#1f4fbf',
          700: '#183d94',
          800: '#132f73',
          900: '#0d204d',
        },
        violet: {
          50: '#f6f1ff',
          100: '#ede4ff',
          200: '#d6c4ff',
          300: '#bea0ff',
          400: '#9b6df5',
          500: '#7C3AED',
          600: '#622ec1',
          700: '#4b2394',
          800: '#36196a',
          900: '#231042',
        },
        beige: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e4dd',
          300: '#d4ccc0',
          400: '#b8ab9a',
          500: '#9d8d7a',
        },
        green: {
          50: '#ecfdf3',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981',
          600: '#0ea965',
          700: '#0b8a53',
          800: '#0a6f44',
          900: '#065f36',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

