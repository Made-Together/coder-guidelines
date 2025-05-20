// Define base colors first
const baseColors = {
	white: {
		hex: "#ffffff",
		cmyk: "0, 0, 0, 0",
	},
	black: {
		hex: "#090B0B",
		cmyk: "70, 40, 40, 100",
	},
};

const tertiaryColors = {
	tertiary: {
		hex: "#F8F2F1",
		cmyk: "10, 12, 8, 0",
	},
};

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	safelist: [
		{
			pattern: /^bg-/,
			variants: ["hover", "focus", "active"],
		},
		{
			pattern: /^text-/,
			variants: ["hover", "focus", "active"],
		},
	],
	darkMode: ["class"],
	theme: {
		container: (theme) => ({
			maxWidth: "100%",
			center: true,
			padding: {
				DEFAULT: theme("spacing.6"),
				lg: theme("spacing.12"),
			},
		}),
		extend: {
			colors: {
				// Theme colors that reference base colors
				core: baseColors.black.hex,
				accent: baseColors.white.hex,
				// Primary Colors
				primaries: {
					...Object.fromEntries(Object.entries(baseColors).map(([key, value]) => [key, { hex: value.hex, cmyk: value.cmyk }])),
				},
				tertiary: tertiaryColors.tertiary.hex,
				// Secondary Colors
				secondaries: {
					magenta: {
						hex: "#F08DFF",
						cmyk: "20, 60, 0, 0",
					},
					purple: {
						hex: "#BC7CFF",
						cmyk: "22, 45, 0, 0",
					},
					ember: {
						hex: "#FF8067",
						cmyk: "0, 61, 59, 0",
					},
					orchid: {
						hex: "#9900B1",
						cmyk: "48, 100, 0, 9",
					},
					violet: {
						hex: "#7511E2",
						cmyk: "68, 82, 0, 0",
					},
					sunset: {
						hex: "#A13000",
						cmyk: "0, 99, 100, 19",
					},
				},
				// Tertiary Colors
				tertiaries: {
					haze: {
						hex: "#A19CC8",
						cmyk: "44, 38, 0, 0",
					},
					glacier: {
						hex: "#B8D7F5",
						cmyk: "24, 4, 0, 0",
					},
					sky: {
						hex: "#A4E8F2",
						cmyk: "37, 0, 0, 0",
					},
					twilight: {
						hex: "#4A408F",
						cmyk: "92, 97, 0, 0",
					},
					marine: {
						hex: "#1D4D7D",
						cmyk: "100, 67, 0, 33",
					},
					jade: {
						hex: "#005C6A",
						cmyk: "98, 21, 11, 49",
					},
				},
				// Accent Colors
				accents: {
					shell: {
						hex: "#F8F2F1",
						cmyk: "10, 12, 8, 0",
					},
					linen: {
						hex: "#FBF8F8",
						cmyk: "5, 6, 3, 0",
					},
					cinder: {
						hex: "#18171A",
						cmyk: "81, 67, 55, 83",
					},
					smoke: {
						hex: "#2F2D33",
						cmyk: "71, 53, 55, 70",
					},
				},
			},
			borderRadius: {
				default: "6px",
			},
			fontFamily: {
				headings: ["Lay Grotesk", "sans-serif"],
				body: ["Lay Grotesk", "sans-serif"],
				accent: ["FT System Mono Trial", "sans-serif"],
				google: ["Geist", "sans-serif"],
				google2: ["Geist Mono", "sans-serif"],
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
};
