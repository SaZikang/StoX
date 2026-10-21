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
          dark: '#0a0b0e',
          card: '#12141a',
          cardHover: '#1a1d26',
          border: '#222632',
          borderLight: '#2f3542',
          accent: '#3b82f6',
          accentHover: '#2563eb',
          green: '#10b981',
          greenBg: 'rgba(16, 185, 129, 0.1)',
          red: '#ef4444',
          redBg: 'rgba(239, 68, 68, 0.1)',
          muted: '#94a3b8',
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
