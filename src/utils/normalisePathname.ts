/* eslint-disable no-param-reassign, prefer-template, no-restricted-imports */
import nextConfig from '../../next.config.mjs';

const { trailingSlash } = nextConfig;

export default function normalisePathname(pathname: string): string {
	// Return an empty string if no pathname is provided
	if (!pathname) return "";

	// Remove the site URL from the pathname
	if (pathname.startsWith(process.env.NEXT_PUBLIC_SITE_URL)) {
		pathname = pathname.replace(process.env.NEXT_PUBLIC_SITE_URL, "");
	}

	// Remove the WordPress base URL from the pathname
	if (pathname.startsWith(process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL)) {
		pathname = pathname.replace(process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL, "");
	}

	// return the URL if it's external
	if (/^https?:\/\//.test(pathname)) {
		return pathname;
	}

	// Ensure we start with a slash
	if (!pathname.startsWith("/")) {
		pathname = "/" + pathname;
	}

	if (trailingSlash) {
		if (!pathname.endsWith("/")) {
			pathname += "/";
		}
	} else if (pathname.endsWith("/") && pathname.length > 1) {
		pathname = pathname.slice(0, -1);
	}

	return pathname;
}
