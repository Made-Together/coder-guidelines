import cms from "~/cms";
import { postListingPages } from "~/cms/config";
import type { PostListingPageConfig } from "~/cms/config";

export const createWpArgsFromSlug = ({ slug }: { slug: string }): PostListingPageConfig & { isListingPage: boolean } => {
	const postPage = postListingPages?.find((page) => slug.startsWith(page.base_path));

	if (!postPage) {
		return {
			isListingPage: false,
		};
	}

	// Check if the slug is a paginated page. // eg: **/page/$NUMBER/
	const pageMatch = slug.match(/page\/(\d+)\/?$/);
	const paged = pageMatch ? parseInt(pageMatch[1], 10) : 1;
	// remove the page number from the slug if so, so we don't have to worry about it later
	// eslint-disable-next-line no-param-reassign
	slug = pageMatch ? slug.slice(0, pageMatch.index) : slug;

	// eslint-disable-next-line no-unused-vars
	const [basePath, postSlugOrTaxonomy, taxonomyTermName] = slug.split("/").filter(Boolean);

	const args = {
		...postPage,
		paged,
		isListingPage: !postSlugOrTaxonomy,
		taxonomies: null,
		selectedTaxonomies: postPage.taxonomies || null,
	};

	// Look though taxonomies to see if the first part of the path matches a taxonomy. If it does, it's a listing page
	const taxonomyMatch = postPage.taxonomies && postPage.taxonomies.find((tax) => tax.url === postSlugOrTaxonomy);
	if (taxonomyMatch && taxonomyTermName) {
		// If the second part of the path is a taxonomy term, it's a listing page
		// eg: /resources/category/some-category would result in args.taxonomies = { category: "some-category" }
		// eg: /customer-stories/type/example-term-name would result in args.taxonomies = { type: "example-term-name" }
		args.taxonomies = {
			[taxonomyMatch.taxonomy_name]: taxonomyTermName,
		};

		// isListingPage is now true because we have a taxonomy slug and term name
		args.isListingPage = true;
	}

	return args;
};

export default async function getListingPageData({ slug = "" }: { slug: string }) {
	const args = createWpArgsFromSlug({ slug });

	if (!args?.isListingPage) {
		return {};
	}

	const [response, taxonomyTerms] = await Promise.all([
		cms.post("/wp-json/together/get", args),
		cms.post("/wp-json/together/get_terms_by_post_type", {
			post_type: args?.post_type,
			selectedTaxonomies: args?.selectedTaxonomies,
			base_path: args?.base_path,
		}),
	]);

	return { ...args, ...response, taxonomyTerms };
}
