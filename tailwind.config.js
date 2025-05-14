/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary))',
          50: 'rgba(var(--color-primary), 0.05)',
          100: 'rgba(var(--color-primary), 0.1)',
          200: 'rgba(var(--color-primary), 0.2)',
          300: 'rgba(var(--color-primary), 0.3)',
          400: 'rgba(var(--color-primary), 0.4)',
          500: 'rgba(var(--color-primary), 0.5)',
          600: 'rgba(var(--color-primary), 0.6)',
          700: 'rgba(var(--color-primary), 0.7)',
          800: 'rgba(var(--color-primary), 0.8)',
          900: 'rgba(var(--color-primary), 0.9)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary))',
          50: 'rgba(var(--color-secondary), 0.05)',
          100: 'rgba(var(--color-secondary), 0.1)',
          200: 'rgba(var(--color-secondary), 0.2)',
          300: 'rgba(var(--color-secondary), 0.3)',
          400: 'rgba(var(--color-secondary), 0.4)',
          500: 'rgba(var(--color-secondary), 0.5)',
          600: 'rgba(var(--color-secondary), 0.6)',
          700: 'rgba(var(--color-secondary), 0.7)',
          800: 'rgba(var(--color-secondary), 0.8)',
          900: 'rgba(var(--color-secondary), 0.9)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent))',
          50: 'rgba(var(--color-accent), 0.05)',
          100: 'rgba(var(--color-accent), 0.1)',
          200: 'rgba(var(--color-accent), 0.2)',
          300: 'rgba(var(--color-accent), 0.3)',
          400: 'rgba(var(--color-accent), 0.4)',
          500: 'rgba(var(--color-accent), 0.5)',
          600: 'rgba(var(--color-accent), 0.6)',
          700: 'rgba(var(--color-accent), 0.7)',
          800: 'rgba(var(--color-accent), 0.8)',
          900: 'rgba(var(--color-accent), 0.9)',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success))',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning))',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
};