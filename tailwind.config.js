/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#dff2ff',
          500: '#18a6e4',
          600: '#0875c6',
          700: '#0569b2',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 36px rgba(8, 117, 198, 0.18)',
      },
    },
  },
  plugins: [],
};
