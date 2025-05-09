// Define base colors first
const baseColors = {
	white: "#ffffff",
	black: "#090B0B",
};

const tertiaryColors = {
	tertiary: "#FDF8F3",
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
				core: baseColors.black,
				accent: baseColors.white,
				// Primary Colors
				primaries: baseColors,
				tertiary: tertiaryColors.tertiary,
				// Secondary Colors
				secondaries: {
					magenta: "#F08DFF",
					purple: "#BC7CFF",
					ember: "#FF8067",
					orchid: "#9900B1",
					violet: "#7511E2",
					sunset: "#A13000",
				},
				// Tertiary Colors
				tertiaries: {
					haze: "#A19CC8",
					glacier: "#B8D7F5",
					sky: "#A4E8F2",
					twilight: "#4A408F",
					marine: "#1D4D7D",
					jade: "#005C6A",
				},
				// Accent Colors
				accents: {
					shell: "#F8F2F1",
					linen: "#FBF8F8",
					cinder: "#18171A",
					smoke: "#2F2D33",
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
