// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      screens: {
        xs: '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // TableTech thema kleuren
        'tabletech': {
          DEFAULT: 'var(--tabletech-primary)',
          hover: 'var(--tabletech-primary-hover)',
          light: 'var(--tabletech-primary-light)',
          dark: 'var(--tabletech-primary-dark)',
          bg: 'var(--tabletech-bg)',
          text: 'var(--tabletech-text)',
          accent: 'var(--tabletech-accent)',
          'accent-light': 'var(--tabletech-accent-light)',
          card: 'var(--tabletech-card)',
          secondary: 'var(--tabletech-secondary)',
        },
        
        // Spice Palace thema kleuren
        'spicepalace': {
          DEFAULT: 'var(--spicepalace-primary)',
          hover: 'var(--spicepalace-primary-hover)',
          light: 'var(--spicepalace-primary-light)',
          dark: 'var(--spicepalace-primary-dark)',
          bg: 'var(--spicepalace-bg)',
          text: 'var(--spicepalace-text)',
          accent: 'var(--spicepalace-accent)',
          'accent-light': 'var(--spicepalace-accent-light)',
          card: 'var(--spicepalace-card)',
          secondary: 'var(--spicepalace-secondary)',
        },
        
        // Sweet Delights thema kleuren
        'sweetdelights': {
          DEFAULT: 'var(--sweetdelights-primary)',
          hover: 'var(--sweetdelights-primary-hover)',
          light: 'var(--sweetdelights-primary-light)',
          dark: 'var(--sweetdelights-primary-dark)',
          bg: 'var(--sweetdelights-bg)',
          text: 'var(--sweetdelights-text)',
          accent: 'var(--sweetdelights-accent)',
          'accent-light': 'var(--sweetdelights-accent-light)',
          card: 'var(--sweetdelights-card)',
          secondary: 'var(--sweetdelights-secondary)',
        },
        
        // Coffee Corner thema kleuren
        'coffeecorner': {
          DEFAULT: 'var(--coffeecorner-primary)',
          hover: 'var(--coffeecorner-primary-hover)',
          light: 'var(--coffeecorner-primary-light)',
          dark: 'var(--coffeecorner-primary-dark)',
          bg: 'var(--coffeecorner-bg)',
          text: 'var(--coffeecorner-text)',
          accent: 'var(--coffeecorner-accent)',
          'accent-light': 'var(--coffeecorner-accent-light)',
          card: 'var(--coffeecorner-card)',
          secondary: 'var(--coffeecorner-secondary)',
        },
        
        // Utility kleuren
        'success': {
          DEFAULT: 'var(--success)',
          light: 'var(--success-light)',
        },
        'warning': {
          DEFAULT: 'var(--warning)', 
          light: 'var(--warning-light)',
        },
        'error': {
          DEFAULT: 'var(--error)',
          light: 'var(--error-light)',
        },
        'info': {
          DEFAULT: 'var(--info)',
          light: 'var(--info-light)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      keyframes: {
        'move-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0.1' },
          '50%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100%)', opacity: '0.1' },
        },
        'border-beam': {
          'to': { 'offset-distance': '100%' },
        },
      },
      animation: {
        'move-down': 'move-down 3.5s linear infinite',
        'border-beam': 'border-beam var(--duration) infinite linear',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
