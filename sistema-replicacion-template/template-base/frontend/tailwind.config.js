/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizables por empresa
        primary: {
          DEFAULT: process.env.EMPRESA_COLOR_PRIMARIO || '#1e40af',
          50: process.env.EMPRESA_COLOR_PRIMARIO_50 || '#eff6ff',
          100: process.env.EMPRESA_COLOR_PRIMARIO_100 || '#dbeafe',
          500: process.env.EMPRESA_COLOR_PRIMARIO || '#1e40af',
          600: process.env.EMPRESA_COLOR_PRIMARIO_600 || '#1d4ed8',
          700: process.env.EMPRESA_COLOR_PRIMARIO_700 || '#1e3a8a',
          900: process.env.EMPRESA_COLOR_PRIMARIO_900 || '#1e3a8a',
        },
        secondary: {
          DEFAULT: process.env.EMPRESA_COLOR_SECUNDARIO || '#059669',
          50: process.env.EMPRESA_COLOR_SECUNDARIO_50 || '#ecfdf5',
          100: process.env.EMPRESA_COLOR_SECUNDARIO_100 || '#d1fae5',
          500: process.env.EMPRESA_COLOR_SECUNDARIO || '#059669',
          600: process.env.EMPRESA_COLOR_SECUNDARIO_600 || '#047857',
        },
        accent: {
          DEFAULT: process.env.EMPRESA_COLOR_ACENTO || '#dc2626',
          50: process.env.EMPRESA_COLOR_ACENTO_50 || '#fef2f2',
          100: process.env.EMPRESA_COLOR_ACENTO_100 || '#fee2e2',
          500: process.env.EMPRESA_COLOR_ACENTO || '#dc2626',
          600: process.env.EMPRESA_COLOR_ACENTO_600 || '#dc2626',
        },
        // Colores del portal UGT genérico
        ugt: {
          red: '#E60012',        // Rojo UGT oficial
          blue: '#003366',       // Azul UGT oficial
          gold: '#FFD700',       // Dorado UGT
          gray: '#6B7280',       // Gris neutro
          'gray-light': '#F3F4F6'
        }
      },
      fontFamily: {
        'corporate': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
