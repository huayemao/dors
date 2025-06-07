const { fontFamily } = require("tailwindcss/defaultTheme");
const { withShurikenUI } = require("@shuriken-ui/tailwind");
const colors = require("tailwindcss/colors");

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
	darkMode: ["class"],
	theme: {
		extend: {
			boxShadow: {
				'right-inner': 'inset -28px 0 24px -20px  rgba(0,0,0,0.3)',
			},
			nui: {},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: [
						{
							"strong": {
								fontWeight: 'bold',
							},
							// "a:active": { color: colors.green[700] },
							// "a:visited": { color: colors.green[900] },
							"a code,h1 code,h2 code,h3 code,h4 code,blockquote code": {
								color: theme("colors.primary[500]"),
								"@apply dark:text-primary-400": {},
							},
							blockquote: {
								quotes: `"“" "„"`,
							},
							"blockquote p": {
								position: "relative",
								"&:first-of-type::before, &:last-of-type::after": {
									color: theme("colors.primary[500]"),
									fontSize: "3em",
									fontFamily: "ui-serif",
								},
								"&:first-of-type::before": {
									position: "absolute",
									left: "-3rem",
									top: "-2.5rem",
								},
								"&:last-of-type::after": {
									position: "absolute",
									right: "-1rem",
									bottom: "-2.5rem",
								},
							},
							"thead th code": {
								color: theme("colors.primary[500]"),
								"@apply dark:text-primary-400": {},
							},
							code: {
								fontWeight: 500,
								color: theme("colors.primary[500]"),
								backgroundColor: theme("colors.primary[100]"),
								"@apply dark:bg-primary-900 dark:text-primary-300": {},
							},
							"pre code": {
								fontFamily: "monospace",
								"@apply dark:bg-slate-900 dark:text-slate-100": {},
							},
							"ul, ol, blockquote, figure": {
								breakInside: "avoid",
							},
							table: {
								"@media (max-width: 576px)": {
									// 如果 table 设置成 display:block 来产生滚动条会导致内容无法自动扩展到全宽
									td: {
										wordBreak: "break-all",
									},
								},
							},
							figure: {
								marginBottom: "2em",
								figcaption: { textAlign: "center" },
								img: {
									marginBottom: 0,
								},
							},
							tr: {
								th: {
									"&:first-child": {
										whiteSpace: "nowrap",
									},
								},
								td: {
									"&:first-child": {
										whiteSpace: "nowrap",
									},
								},
							},
						},
					],
				},
			}),
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
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
});
