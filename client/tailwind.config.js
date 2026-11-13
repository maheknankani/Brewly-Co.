/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF9F5',
          100: '#F7F4EE',
          200: '#EFE9DC',
          300: '#E2DACB',
          400: '#D5C9B5',
        },
        espresso: {
          500: '#4A342B',
          700: '#2C1E18',
          800: '#231713',
          900: '#1C1310',
        },
        forest: {
          600: '#36493E',
          700: '#2D3E35',
          800: '#233329',
          900: '#1A2820',
        },
        amberGold: {
          400: '#E6A838',
          500: '#D99B26',
          600: '#C88327',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
