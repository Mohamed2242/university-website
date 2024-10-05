/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      backgroundImage: {
        'university-gradient': 'linear-gradient(to bottom, #E0F7FA, #E3F2FD)',
      },
      height: {
        'screen-gradient': 'min-h-screen bg-university-gradient',
      },
    },
  },
  plugins: [],
}

