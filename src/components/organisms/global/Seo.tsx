import { NextSeo } from "next-seo";
import type { WpPage } from "~/types/wp";
import tailwindConfig from "../../../../tailwind.config.js";

// Get the accent color from the Tailwind config
const themeColor = (tailwindConfig.theme?.extend?.colors as any)?.core || "#6726FF";

type SeoConfig = {
	title: string;
	description: string;
	url: string;
	image: string;
	favicon?: string;
};

type SeoProps = {
	page: WpPage;
	seo?: SeoConfig;
};

type LinkTag = {
	rel: string;
	href: string;
	type?: string;
};

export default function Seo({ page, seo }: SeoProps) {
	// Return null if no SEO config is provided (e.g. on Keystatic routes)
	if (!seo) return null;

	const { title, description, url, image, favicon } = seo;

	const linkTags: LinkTag[] = [
		{
			rel: "manifest",
			href: "/site.webmanifest",
		},
	];

	if (favicon) {
		linkTags.unshift({
			rel: "icon",
			type: "image/png",
			href: `favicon${favicon}`,
		});
	}

	return (
		<NextSeo
			title={title}
			description={description}
			canonical={url}
			twitter={{
				cardType: "summary_large_image",
			}}
			openGraph={{
				url,
				title,
				description,
				images: [
					{
						url: image,
						width: 1200,
						height: 630,
						alt: title,
					},
				],
			}}
			themeColor={themeColor}
			additionalMetaTags={[
				{
					name: "viewport",
					content: "initial-scale=1.0, width=device-width",
				},
				{
					name: "msapplication-TileColor",
					content: themeColor,
				},
				{
					name: "twitter:card",
					content: "summary_large_image",
				},
				{
					name: "twitter:title",
					content: title,
				},
				{
					name: "twitter:description",
					content: description,
				},
				{
					name: "twitter:image",
					content: image,
				},
			]}
			additionalLinkTags={linkTags}
		/>
	);
}
