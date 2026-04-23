import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        lora: ['var(--font-lora)', 'serif'],
      },
      colors: {
        // AcheiSST — paleta oficial da marca
        navy: {
          50:  '#f0f4fa',
          100: '#dde6f5',
          200: '#bdd0eb',
          300: '#8eb0da',
          400: '#5a8bc4',
          500: '#2f6aae',
          600: '#1B3A6B',  // cor primária — "Achei"
          700: '#152d54',
          800: '#0f2040',
          900: '#0a1528',
        },
        sst: {
          50:  '#f0faf0',
          100: '#dcf5dc',
          200: '#b8eab8',
          300: '#7dd67e',
          400: '#4CAF50',  // cor de acento — "SST"
          500: '#3d9940',
          600: '#2d7a30',
          700: '#1e5c21',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
