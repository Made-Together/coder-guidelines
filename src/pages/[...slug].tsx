import WpHotkey from "~/components/atoms/global/WpHotkey";
import Page from "~/components/templates/Page";
import normalisePathname from "~/utils/normalisePathname";
import getListingPageData from "~/cms/getListingPageData";
import cms from "~/cms";
import Seo from "~/components/organisms/global/Seo";
import React from "react";
import dynamic from "next/dynamic";
import type { WpOptions, WpPage, WpPostTypes } from "~/types/wp";

const Post = dynamic(() => import("~/components/templates/Post"));
const ListingRenderer = dynamic(() => import("~/components/templates/ListingRenderer"));

type TemplateProps = {
	page: WpPage;
	options: WpOptions;
	postListingResponse: any;
};

type PostTypeLayouts = {
	[K in WpPostTypes]: React.ComponentType<{ page: WpPage }>;
};

const postTypeLayouts: PostTypeLayouts = {
	post: Post,
	page: Page,
};

export default function Template(data: TemplateProps) {
	const { page, options, postListingResponse: listingContext } = data;
	const Layout = postTypeLayouts[page?.post_type] || postTypeLayouts.page;

	return (
		<>
			<Seo
				page={page}
				seo={
					page?.post_title
						? {
								title: page.post_title,
								description: "",
								url: "",
								image: "",
							}
						: undefined
				}
			/>
			<Layout page={page} />
			{listingContext && Object.keys(listingContext).length > 0 && <ListingRenderer listingContext={listingContext} />}
			<WpHotkey id={page?.ID} />
		</>
	);
}

export async function getStaticPaths() {
	const data = await cms.paths();
	// Filter out any paths that start with /keystatic
	const filteredPaths = data.filter((path) => !path.startsWith("/keystatic"));
	return {
		paths: filteredPaths.map((path) => ({
			params: {
				slug: path.split("/").filter(Boolean),
			},
		})),
		fallback: "blocking",
	};
}

export async function getStaticProps({ params }) {
	let slug = normalisePathname(typeof params.slug !== "string" ? `/${params.slug.join("/")}/` : params.slug);

	// If this is a Keystatic route, return notFound
	if (slug.startsWith("/keystatic")) {
		return {
			redirect: {
				destination: "/keystatic",
				permanent: false,
			},
		};
	}

	// See if slug matches the post listing page config
	const postListingResponse = await getListingPageData({ slug });

	// If the page is a listing page, use the base path
	if (postListingResponse?.base_path) {
		slug = postListingResponse.base_path;
	}

	const [page, options] = await Promise.all([cms.page(slug), cms.options()]);

	// If page returns empty object or page isn't published, try to match to a redirect
	if (!page?.post_title || page?.post_status !== "publish" || !options) {
		return cms.handleRedirectOrPageNotFound(slug);
	}

	return {
		props: {
			page,
			options,
			postListingResponse,
		},
		revalidate: 6000,
	};
}
