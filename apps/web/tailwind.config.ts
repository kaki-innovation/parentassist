import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF8ED',
          100: '#FFF0D3',
          200: '#FFDDA6',
          300: '#FFC46E',
          400: '#FFA033',
          500: '#FF8200',
          600: '#E06500',
          700: '#B84C00',
          800: '#923C04',
          900: '#783308',
        },
        cream: {
          50: '#FFFDF7',
          100: '#FFF9EC',
          200: '#FFF3D3',
          300: '#FFE9B2',
          400: '#FFD97A',
          500: '#FFC940',
        },
      },
      fontFamily: {
        heading: ["'Playfair Display'", 'Georgia', 'serif'],
        body: ["'DM Sans'", 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
