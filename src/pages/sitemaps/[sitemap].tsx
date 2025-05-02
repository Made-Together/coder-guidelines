import fetchYoastSitemap from "~/utils/fetch-yoast-sitemap";

export default function Sitemap() {}

export const getServerSideProps = async ({ res, params }) => {
	const urls = await fetchYoastSitemap(`${process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL}/${params.sitemap}`);

	if ("notFound" in urls) {
		return {
			notFound: true,
		};
	}

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${urls
		.map(
			({ loc, lastmod }) => `
	<url>
		<loc>${baseUrl}${loc}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>1.0</priority>
	</url>`
		)
		.join("")}
</urlset>
  `;

	res.setHeader("Content-Type", "text/xml");
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
};
