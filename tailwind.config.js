const { fontFamily } = require("tailwindcss/defaultTheme")
const { withShurikenUI } = require("@shuriken-ui/tailwind")
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = withShurikenUI({
  // mode: 'jit',
  content: [
    "app/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,tsx}",
    "node_modules/@shuriken-ui/react/dist/**/*.js",
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      nui: {},
      typography: {
        DEFAULT: {
          css: [
            {
              'a:active': { color: colors.indigo[700] },
              'a:visited': { color: colors.indigo[900] },
              'a code': {
                color: colors.indigo[500],
              },
              'h1 code': {
                color: colors.indigo[500],
              },
              'h2 code': {
                color: colors.indigo[500],
              },
              'h3 code': {
                color: colors.indigo[500],
              },
              'h4 code': {
                color: colors.indigo[500],
              },
              'blockquote code': {
                color: colors.indigo[500],
              },
              'thead th code': {
                color: colors.indigo[500],
              },
              code: {
                fontWeight: 500,
                color: colors.indigo[500],
                backgroundColor: colors.indigo[100]
              },
              'ul, ol, blockquote, figure': {
                breakInside: 'avoid',
              },
              table: {
                '@media (max-width: 576px)': {
                  // 如果 table 设置成 display:block 来产生滚动条会导致内容无法自动扩展到全宽
                  td: {
                    wordBreak: 'break-all'
                  }
                },
              },
              figure: {
                marginBottom: '2em',
                figcaption: { textAlign: 'center' },
                img: {
                  marginBottom: 0,
                }
              },
              tr: {
                th: {
                  '&:first-child': {
                    whiteSpace: 'nowrap'
                  }
                },
                td: {
                  '&:first-child': {
                    whiteSpace: 'nowrap'
                  },
                }
              },
            }]
        }
      },
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
        muted: colors.slate,
        primary: colors.indigo,
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
})


