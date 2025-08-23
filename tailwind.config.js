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
		"node_modules/@glint-ui/react/dist/**/*.js",
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
								position: "relative",
								quotes: "none",
								fontStyle:'normal',
								fontFamily: "var(--font-LXGW-WenKai), cursive, serif",
								"@apply my-4 text-muted-900 bg-muted-50 dark:bg-muted-800 dark:text-muted-100 rounded  p-4 pt-8 border-none": {},
								"&::before": {
									content: "''",
									"@apply absolute block left-5 top-4 size-5": {},
									backgroundImage: (() => {
										const quoteColor = encodeURIComponent(theme("colors.primary.500"));
										return `url('data:image/svg+xml;utf8,<svg width=\"27\" height=\"25\" viewBox=\"0 0 27 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.88086 13.6426V24.1538H0.174316V15.8555C0.174316 11.3626 0.710775 8.11035 1.78369 6.09863C3.19189 3.41634 5.42155 1.38786 8.47266 0.0131836L10.6855 3.53369C8.84147 4.30485 7.48356 5.46159 6.61182 7.00391C5.74007 8.5127 5.25391 10.7256 5.15332 13.6426H9.88086ZM25.4717 13.6426V24.1538H15.7651V15.8555C15.7651 11.3626 16.3016 8.11035 17.3745 6.09863C18.7827 3.41634 21.0124 1.38786 24.0635 0.0131836L26.2764 3.53369C24.4323 4.30485 23.0744 5.46159 22.2026 7.00391C21.3309 8.5127 20.8447 10.7256 20.7441 13.6426H25.4717Z\" fill=\"${quoteColor}\"/></svg>')`;
									})(),
									backgroundRepeat: "no-repeat",
									backgroundSize: "contain",
									opacity: "0.8",
									pointerEvents: "none",
								},
							},
							"blockquote p": {
								position: "relative",
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
				LXGW_WenKai: ["var(--font-LXGW-WenKai)"],
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
