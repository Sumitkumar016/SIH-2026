/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#0F1419',
        card: '#F7F9F9',
        border: '#EFF3F4',
        brand: {
          DEFAULT: '#1D9BF0',
          hover: '#1A8CD8',
          light: '#E8F5FD',
        },
        risk: {
          low: '#10B981',
          lowBg: '#ECFDF5',
          lowText: '#065F46',
          medium: '#F59E0B',
          mediumBg: '#FFFBEB',
          mediumText: '#92400E',
          high: '#EF4444',
          highBg: '#FEF2F2',
          highText: '#991B1B',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 4px 0 rgba(15, 20, 25, 0.06)',
        'hover': '0 4px 12px 0 rgba(15, 20, 25, 0.08)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
