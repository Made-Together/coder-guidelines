type UrlEntry = {
	loc: string;
	lastmod: string;
};

export type FetchResult = UrlEntry[] | { notFound: boolean };

export default async function fetchYoastSitemap(url: string): Promise<FetchResult> {
	try {
		const data = await fetch(url, {
			next: { revalidate: 60 * 15 }, // 15 minutes
		});

		const text = await data.text();

		if (!text || !text.length) {
			return {
				notFound: true,
			};
		}

		const urls = text.match(/<url>([\s\S]*?)<\/url>|<sitemap>([\s\S]*?)<\/sitemap>/gim)?.map((entry) => {
			const loc = entry
				.match(/<loc>(.*?)<\/loc>/g)
				.map((rs) => rs.replace("<loc>", "").replace("</loc>", ""))
				.map((rs) => new URL(rs).pathname)[0];

			return loc?.length
				? {
						loc,
						lastmod:
							entry.match(/<lastmod>(.*?)<\/lastmod>/g).map((rs) => rs.replace("<lastmod>", "").replace("</lastmod>", ""))[0] || new Date().toISOString(),
					}
				: null;
		});

		return urls ?? [];
	} catch (error) {
		//  eslint-disable-next-line no-console
		console.warn(error);
		return {
			notFound: true,
		};
	}
}
