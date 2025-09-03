/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}', // Adjust if needed
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#F5F0FF',
          100: '#EDEDFA',
          200: '#DFD8F9',
          300: '#D9C2EA',
          400: '#C884F7',
          500: '#A76EEE',
          600: '#9155DD',
          700: '#7C3AED',
          800: '#6B46C1',
          900: '#553CDA',
        },
        sage: {
          50: '#F0F9F4',
          100: '#E6F4EA',
          200: '#3EB489',
          300: '#90EB98',
          400: '#6BE988',
          500: '#4ADE80',
        },
        coral: {
          50: '#FFF1F0',
          100: '#FFE4E1',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EDA0BF',
        },
        cream: {
          50: '#FFFEF7',
          100: '#FFFAEB',
          200: '#FEF5C7',
          300: '#FDEB8A',
          400: '#ECD686',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'ui-serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      animation: {
        fadeIn: 'fadeIn ease 0.5s',
        slideUp: 'slideUp ease 0.4s',
        pulse: 'pulse 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      }
    }
  },
  plugins: [],
}
