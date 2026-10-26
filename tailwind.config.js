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
        apple: {
          bg: '#fbfbfd',
          card: '#ffffff',
          darkBg: '#09090b',
          darkCard: '#121215',
          blue: '#0071e3',
          blueHover: '#0077ed',
          darkBlue: '#0a84ff',
          gray: '#86868b',
          lightGray: '#f5f5f7',
          darkBorder: '#27272a',
          success: '#34c759',
          warning: '#ff9f0a',
          danger: '#ff453a',
          purple: '#af52de',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9ddfd',
          300: '#7cc2fb',
          400: '#36a3f7',
          500: '#0071e3',
          600: '#0062c4',
          700: '#0355a3',
          800: '#074886',
          900: '#0c3d6f',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'apple-subtle': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-card': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'apple-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '22px',
        '4xl': '28px',
      },
    },
  },
  plugins: [],
}
