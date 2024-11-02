/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,vue,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        cardShadow: '0px 0px 13px 0px rgba(0, 0, 0, 0.04)'
      }
    },
  },
  plugins: [],
}
