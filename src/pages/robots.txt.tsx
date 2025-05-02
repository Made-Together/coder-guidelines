import cms from "~/cms";

export default function Robots() {}

export const getServerSideProps = async ({ res }) => {
	const data = await cms.robots();
	const is_public = data.blog_public === 1;
	const robots = `User-agent: * ${
		is_public
			? `
Allow: /
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL}/sitemap_index.xml
`
			: `
Disallow: /
`
	}`;

	res.setHeader("Content-Type", "text/plain");
	res.write(robots);
	res.end();

	return {
		props: {},
	};
};
