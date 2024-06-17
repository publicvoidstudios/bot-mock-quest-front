/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat, sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#6172F3',
        secondary: '#F5F8FF',
        primaryLight: '#8098F9',
        primaryLightOpaque: '#8098F91A',
        primaryLightStroke: '#8098F980',
        fontPrimary: '#E0EAFF',
        fontPrimarySubtle: '#E0EAFFBF',
        fontSecondary: '#1a1a1a',
        fontSecondarySubtle: '#71717A',
        fontTretiary: '#2D31A633'

      },
      backgroundImage: {
        'shield-slash': "url('/src/assets/shield-slash.svg')",
        'person': "url('/src/assets/person.svg')",
        'checked': "url('/src/assets/checked-square.svg')",
        'unchecked': "url('/src/assets/unchecked-square.svg')",
      },
      screens: {
        '2xl': '1440px'
      }
    },
  },
  plugins: [],
}