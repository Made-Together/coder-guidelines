// Define base colors first
const baseColors = {
	midnight: "#1E0525",
	white: "#ffffff",
	grape: "#895BE7",
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
				core: baseColors.midnight,
				accent: baseColors.grape,
				// Primary Colors
				primaries: baseColors,
				tertiary: tertiaryColors.tertiary,
				// Secondary Colors
				secondaries: {
					lime: "#F6FFE6",
					slate: "#C3D7DB",
					rose: "#FFDBF3",
					stone: "#A1A5AD",
				},
				// Tertiary Colors
				tertiaries: {
					25: "#FFFCF8",
					50: tertiaryColors.tertiary,
					75: "#F6F0E5",
					100: "#ECE5D8",
				},
				// Accent Colors
				accents: {
					blackcurrant: "#32073E",
					black: "#000000",
				},
			},
			borderRadius: {
				default: "6px",
			},
			fontFamily: {
				headings: ["Arizona Flare", "serif"],
				body: ["Enduro", "sans-serif"],
				google: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
};
