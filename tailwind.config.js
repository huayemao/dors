const { fontFamily } = require("tailwindcss/defaultTheme")
const { withShurikenUI } = require("@shuriken-ui/tailwind")

module.exports = withShurikenUI({
  mode: 'jit',
  content: [
    "app/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{ts,tsx}"
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        muted: {
          50: 'rgb(248, 250, 252)',
          100: 'rgb(241, 245, 249)',
          200: 'rgb(226, 232, 240)',
          300: 'rgb(203, 213, 225)',
          400: 'rgb(148, 163, 184)',
          500: 'rgb(100, 116, 139)',
          600: 'rgb(71, 85, 105)',
          700: 'rgb(51, 65, 85)',
          800: 'rgb(30, 41, 59)',
          900: 'rgb(15, 23, 42)'
        },
        primary: {
          50: 'rgb(238, 242, 255)',
          100: 'rgb(224,231,255)',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: 'rgb(129,140,248)',
          500: 'rgb(99,102,241)',
          600: 'rgb(79,70,229)',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
})


