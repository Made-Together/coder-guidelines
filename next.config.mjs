import withBundleAnalyzer from "@next/bundle-analyzer";
import checkEnvVariablesExist from "./src/utils/checkEnvVariablesExist.js";

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
			{
				protocol: "file",
				hostname: "**",
			},
		],
		unoptimized: true,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
		},
	},
	api: {
		bodyParser: false,
		responseLimit: "10mb",
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
	redirects: async () => import("./redirects.json"),
	webpack: (config, { isServer }) => {
		const newConfig = { ...config };

		newConfig.module = {
			...newConfig.module,
			rules: [
				...newConfig.module.rules,
				{
					test: /\.svg$/,
					use: ["@svgr/webpack"],
				},
			],
		};

		// Handle Node.js modules
		if (!isServer) {
			newConfig.resolve = {
				...newConfig.resolve,
				fallback: {
					...newConfig.resolve.fallback,
					fs: false,
					path: false,
					os: false,
					crypto: false,
					stream: false,
					buffer: false,
				},
				alias: {
					...newConfig.resolve.alias,
					"node:fs/promises": false,
					"node:fs": false,
					"node:path": false,
					"node:os": false,
					"node:crypto": false,
					"node:stream": false,
					"node:buffer": false,
				},
			};
		}

		return newConfig;
	},
};

const finalConfig = process.env.ANALYZE === "true" ? withBundleAnalyzer({ enabled: true })(nextConfig) : nextConfig;

export default finalConfig;
