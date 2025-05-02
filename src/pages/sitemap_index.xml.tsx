import fetchYoastSitemap from "~/utils/fetch-yoast-sitemap";

export default function Sitemap() {}

export const getServerSideProps = async ({ res }) => {
	const urls = await fetchYoastSitemap(`${process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL}/sitemap_index.xml`);

	if ("notFound" in urls) {
		return {
			notFound: true,
		};
	}

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		({ loc, lastmod }) => `
<sitemap>
		<loc>${baseUrl}/sitemaps${loc}</loc>
		<lastmod>${lastmod}</lastmod>
	</sitemap>`
	)
	.join("")}
</sitemapindex>
  `;

	res.setHeader("Content-Type", "text/xml");
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
};
