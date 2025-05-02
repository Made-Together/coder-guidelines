# Live Guidelines App

A Next.js application for managing and displaying brand guidelines with dynamic theming support.

## Setup Instructions

### 1. Project Structure

```
.
├── public/
│   └── fonts/
│       ├── heading/
│       │   ├── ArizonaFlare-Light.woff2
│       │   └── ArizonaFlare-Regular.woff2
│       ├── body/
│       │   └── [Enduro font files]
│       └── google/
│           └── [Inter font files]
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── _typography.scss
│   │       ├── _mixins.scss
│   │       └── globals.scss
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── hooks/
│   ├── contexts/
│   ├── types/
│   └── cms/
├── tailwind.config.js
├── next.config.js
├── package.json
└── tsconfig.json
```

### 2. Color Configuration

Colors are managed in `tailwind.config.js` using a structured approach:

```javascript
// Base colors (primary brand colors)
const baseColors = {
	midnight: "#1E0525",
	white: "#ffffff",
	grape: "#895BE7",
};

// Theme configuration
module.exports = {
	theme: {
		extend: {
			colors: {
				// Core theme colors
				core: baseColors.midnight,
				accent: baseColors.grape,

				// Color categories
				primaries: baseColors,
				secondaries: {
					lime: "#F6FFE6",
					slate: "#C3D7DB",
					rose: "#FFDBF3",
					stone: "#A1A5AD",
				},
				tertiaries: {
					25: "#FFFCF8",
					50: "#FDF8F3",
					75: "#F6F0E5",
					100: "#ECE5D8",
				},
				accents: {
					blackcurrant: "#32073E",
					black: "#000000",
				},
			},
		},
	},
};
```

To add new colors:

1. Add base colors to the `baseColors` object if they're primary brand colors
2. Add themed colors to the appropriate category in the `colors` configuration
3. Use colors in your components with Tailwind classes: `bg-primaries-midnight`, `text-secondaries-lime`, etc.

### 3. Font Management

The app uses three font categories configured in Tailwind:

- `headings`: For all heading text (Arizona Flare)
- `body`: For main body text (Enduro)
- `google`: For fallback/alternative text (Inter)

#### Font Structure

```
public/
└── fonts/
    ├── heading/
    │   ├── ArizonaFlare-Light.woff2
    │   └── ArizonaFlare-Regular.woff2
    ├── body/
    │   └── [Enduro font files]
    └── google/
        └── [Inter font files]
```

#### Adding New Fonts

1. Add your font files to the appropriate directory in `public/fonts/`:

   - Heading fonts go in `public/fonts/heading/`
   - Body fonts go in `public/fonts/body/`
   - Google fonts go in `public/fonts/google/`

2. Use the following naming convention for font files:

   - `[FontName]-[Weight].woff2`
   - Example: `ArizonaFlare-Light.woff2`, `ArizonaFlare-Regular.woff2`

3. The fonts are automatically discovered and configured in `tailwind.config.js`:

```javascript
fontFamily: {
    headings: ["Arizona Flare", "serif"],
    body: ["Enduro", "sans-serif"],
    google: ["Inter", "sans-serif"],
}
```

4. Use the fonts in your components with Tailwind classes:

```jsx
<h1 className="font-headings text-h1">Heading Text</h1>
<p className="font-body">Body text</p>
<span className="font-google">Alternative text</span>
```

Font weights are automatically applied based on the font files available in each category folder. No manual CSS `@font-face` declarations are needed - the system automatically discovers and loads fonts based on the directory structure.

### 4. Development

```bash
# Install dependencies
yarn

# Run development server
yarn develop

# Build for production
yarn build

# Start production server
yarn start
```

### 5. ESLint Configuration

The project uses a custom ESLint configuration to maintain code quality while allowing flexibility for specific use cases. Key configurations:

```json
{
	"extends": ["next/core-web-vitals", "airbnb", "prettier"],
	"plugins": ["import", "prettier"],
	"ignorePatterns": ["*.css", "*.scss", "*.sass", "*.less"]
}
```

### 6. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

# Brand Guidelines Template

This is a template repository for creating brand guidelines using Next.js and Keystatic CMS.

## Getting Started

1. Click the "Use this template" button on GitHub to create a new repository
2. Clone your new repository
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Copy `.env.local.example` to `.env.local` and configure your environment variables
5. Start the development server:
   ```bash
   yarn dev
   ```

## Customizing for Your Brand

1. Update the content in the `content/` directory with your brand's guidelines
2. Modify the theme and styling in `src/` to match your brand
3. Update the global configuration in `content/global.yaml`

## Structure

- `content/` - Your brand's content and assets
- `src/` - Application code and components
- `public/` - Static assets
- `keystatic.config.ts` - CMS configuration

## Updating from Template

To get updates from this template:

1. Add this template as a remote:
   ```bash
   git remote add template https://github.com/your-org/brand-guidelines-template.git
   ```
2. Fetch updates:
   ```bash
   git fetch template
   ```
3. Merge updates:
   ```bash
   git merge template/main
   ```

## CMS Access

The application uses Keystatic as its CMS. You can access the CMS interface at:
```
http://localhost:3000/keystatic
```

This interface allows you to:
- Edit all content in the `content/` directory
- Manage global configuration
- Update brand assets and images
- Edit chapter content and structure
