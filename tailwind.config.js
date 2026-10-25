/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        stox: {
          dark: '#0b0e14',
          card: '#131722',
          cardHover: '#1e222d',
          border: '#2a2e39',
          borderLight: '#363c4e',
          accent: '#2962ff',
          accentHover: '#1e48e8',
          green: '#00b42a',
          greenBg: 'rgba(0, 180, 42, 0.1)',
          red: '#f53f3f',
          redBg: 'rgba(245, 63, 63, 0.1)',
          muted: '#848e9c',
          blurple: '#5865F2',
          success: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
