import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/botpress/**/*.{js,ts,jsx,tsx,mdx}',  // Hinzugefügt für Botpress-Komponenten
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter, sans-serif', { fontFeatureSettings: '"cv11"' }],
      },
      keyframes: {
        skeleton: {
          '0%': { backgroundColor: 'rgb(229, 231, 235)' },
          '50%': { backgroundColor: 'rgb(209, 213, 219)' },
          '100%': { backgroundColor: 'rgb(229, 231, 235)' },
        }
      },
      animation: {
        skeleton: 'skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
export default config