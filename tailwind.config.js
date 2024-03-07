/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'purple': '#6658dd',
      'dark-purple': '#4938d7',
      'midnight': '#121063',
      '#ced4da': '#ced4da',
      '#f7f7f7': '#f7f7f7',
      'metal': '#98a6ad',
      'grey': '#6c757d',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
    },
  },
  plugins: [],
}