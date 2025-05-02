const colorText = (text, type) => {
	const colorCode = type === "error" ? "31" : "33";
	const heading = type === "error" ? "🚨 Error" : "Warning";
	return `\n\r \x1b[${colorCode}m \n\r${heading}\n\r \n\r${text}\x1b[0m \n\r`;
};

const checkEnvVariablesExist = () => {
	const missingVars = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_WORDPRESS_BASE_URL"].filter((varName) => !process.env[varName]);

	if (missingVars.length > 0) {
		const formattedVars = missingVars.map((varName) => colorText(varName, "33")).join(" and ");
		const isAre = missingVars.length > 1 ? "are" : "is";
		const errorMessage = colorText(`${formattedVars} ${isAre} missing from the environment variables.`, "error");
		// eslint-disable-next-line no-console
		console.error(errorMessage);
		process.exit(1);
	}

	if (!hostEnvsHaveProtocol()) {
		// eslint-disable-next-line no-console
		console.error(colorText("NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_WORDPRESS_BASE_URL should not include a protocol.", "error"));
		process.exit(1);
	}

	if (hostEnvsHaveTrailingSlashes()) {
		// eslint-disable-next-line no-console
		console.error(colorText("NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_WORDPRESS_BASE_URL should not include a trailing slash.", "error"));
		process.exit(1);
	}
};

function hostEnvsHaveProtocol() {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
	const wordpressBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL;

	const siteUrlHasProtocol = siteUrl.startsWith("http://") || siteUrl.startsWith("https://");
	const wordpressBaseUrlHasProtocol = wordpressBaseUrl.startsWith("http://") || wordpressBaseUrl.startsWith("https://");

	return siteUrlHasProtocol && wordpressBaseUrlHasProtocol;
}

function hostEnvsHaveTrailingSlashes() {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
	const wordpressBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL;

	const siteUrlHasTrailingSlash = siteUrl.endsWith("/");
	const wordpressBaseUrlHasTrailingSlash = wordpressBaseUrl.endsWith("/");

	return siteUrlHasTrailingSlash || wordpressBaseUrlHasTrailingSlash;
}

module.exports = checkEnvVariablesExist;
