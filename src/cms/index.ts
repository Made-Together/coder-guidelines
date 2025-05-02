import { WpOptions, WpPage, WpRedirect, WpSearchRequest } from "~/types/wp";
import cacheBustingString from "~/utils/cacheBustingString";

class CMS {
	private static instance: CMS; // Singleton instance

	private cache: { [key: string]: any }; // Cache object

	private baseUrl: string; // Base URL of the WordPress API

	private constructor() {
		this.baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL;
		this.cache = {};
	}

	static getInstance() {
		if (!CMS.instance) {
			CMS.instance = new CMS();
		}
		return CMS.instance;
	}

	/**
	 * Fetch data from WordPress API
	 * @param url
	 * @param options
	 */
	async fetchFromWp(url: string, options?: object) {
		const processedUrl = `${this.baseUrl}/${cacheBustingString(url)}`;
		const processedOptions = { next: { revalidate: 60 * 10 }, ...options };
		try {
			const res = await fetch(processedUrl, processedOptions);
			const data = res.json();
			return data;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(`${error.code} ${error.message} on URL ${processedUrl}`);
			return process.exit(1);
		}
	}

	/**
	 * Fetch data from WordPress API and cache it
	 * @param key - Cache key
	 * @param fetchFunction - Function to fetch data
	 */
	private async fetchAndCache<T>(key: string, fetchFunction: () => Promise<T>): Promise<T> {
		if (this.cache[key] && this.cache[key].length > 0) {
			return this.cache[key];
		}

		const data = await fetchFunction();
		this.cache[key] = data;
		return data;
	}

	/**
	 * Get all paths from WordPress
	 */
	async paths(): Promise<string[]> {
		return this.fetchAndCache("paths", async () => this.fetchFromWp("/wp-json/together/paths"));
	}

	/**
	 * Get a page from WordPress
	 */
	async page(slug: string): Promise<WpPage> {
		const data: WpPage = await this.fetchFromWp(`/wp-json/together/post?slug=${slug}`);
		return data;
	}

	/**
	 * Get global ACF options from WordPress
	 */
	async options(): Promise<WpOptions> {
		return this.fetchAndCache("options", async () => this.fetchFromWp(`/wp-json/together/options`));
	}

	/**
	 * Get a post from WordPress
	 */
	async preview(post_id: number): Promise<WpPage> {
		const data: WpPage = await this.fetchFromWp(`/wp-json/together/preview?post_id=${post_id}&cache=${+new Date()}`, {
			next: {
				revalidate: 0,
			},
			cache: "no-cache",
		});
		return data;
	}

	/**
	 * Get the indexable status of the site from the CMS
	 */
	async robots(): Promise<{
		blog_public: number;
	}> {
		return this.fetchAndCache("robots", async () => this.fetchFromWp(`/wp-json/together/robots`));
	}

	/**
	 * Generic get method to fetch data from WordPress
	 */
	async get(path: string, options?: object): Promise<any> {
		const data = await this.fetchFromWp(path, options);
		return data;
	}

	/**
	 * Generic post method to fetch data from WordPress
	 */
	async post(path: string, body: object): Promise<any> {
		const data = await this.get(path, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		return data;
	}

	/**
	 * Get search results from WordPress
	 * @param query - The search query
	 * @param postType - The post type to search
	 * @param perPage - The number of results to return
	 */
	async search({ query = "", postType = "post", perPage = 20 }: WpSearchRequest): Promise<any> {
		const cacheKey = `search_${query}_${postType}_${perPage}`;
		return this.fetchAndCache(cacheKey, async () => this.fetchFromWp(`/wp-json/together/search?q=${query}&post_type=${postType}&per_page=${perPage}`));
	}

	/**
	 * Get a post from WordPress
	 */
	async redirects(): Promise<WpRedirect[]> {
		return this.fetchAndCache("redirects", async () => {
			try {
				return await this.fetchFromWp(`/wp-json/together/redirects`);
			} catch (error) {
				return [];
			}
		});
	}

	/**
	 * Handle redirect or 404
	 * @param slug

	 */
	async handleRedirectOrPageNotFound(slug: string): Promise<{
		redirect?: {
			destination: string;
			permanent: boolean;
		};
		notFound?: boolean;
	}> {
		const redirects = await this.redirects();
		if (redirects) {
			const match = redirects.filter(({ source }) => source === slug || source === `${slug}/`).pop();
			if (match?.destination) {
				return {
					redirect: {
						destination: match?.destination,
						permanent: true,
					},
				};
			}
		}

		// No redirect found, return 404
		return {
			notFound: true,
		};
	}
}

/**
 * Export a singleton instance of the CMS class
 */
const cms = CMS.getInstance();
export default cms;
