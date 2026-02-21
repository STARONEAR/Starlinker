import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0B0F14',
          secondary: '#151B23',
          tertiary: '#1F2937',
        },
        surface: {
          glass: 'rgba(255, 255, 255, 0.05)',
          'glass-border': 'rgba(255, 255, 255, 0.1)',
          'glass-hover': 'rgba(255, 255, 255, 0.08)',
        },
        primary: {
          main: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
          neon: '#06B6D4',
        },
        secondary: {
          main: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
          neon: '#10B981',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
