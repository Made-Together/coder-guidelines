const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === "true" });
const checkEnvVariablesExist = require("./src/utils/checkEnvVariablesExist");

checkEnvVariablesExist();

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	trailingSlash: true,
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		formats: ["image/avif", "image/webp"],
		deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.wpengine.com",
			},
			{
				protocol: "https",
				hostname: "**.wpenginepowered.com",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
		],
		unoptimized: true,
	},
	rewrites: async () => ({
		beforeFiles: [
			{
				source: "/wp-content/:path*",
				destination: `${process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL}/wp-content/:path*`,
			},
		],
		afterFiles: [],
		fallback: [],
	}),
	redirects: async () => require("./redirects.json"),
	webpack: (webpackConfig, { isServer }) => {
		webpackConfig.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});

		// Handle Node.js modules
		if (!isServer) {
			webpackConfig.resolve.fallback = {
				...webpackConfig.resolve.fallback,
				fs: false,
				path: false,
				os: false,
				crypto: false,
				stream: false,
				buffer: false,
			};
		}

		// Add polyfills for Node.js modules
		webpackConfig.resolve.alias = {
			...webpackConfig.resolve.alias,
			"node:fs/promises": require.resolve("node:fs/promises"),
			"node:fs": require.resolve("node:fs"),
			"node:path": require.resolve("node:path"),
			"node:os": require.resolve("node:os"),
			"node:crypto": require.resolve("node:crypto"),
			"node:stream": require.resolve("node:stream"),
			"node:buffer": require.resolve("node:buffer"),
		};

		return webpackConfig;
	},
};

let finalConfig = nextConfig;
if (process.env.ANALYZE === "true") {
	finalConfig = withBundleAnalyzer(finalConfig);
}

module.exports = finalConfig;
