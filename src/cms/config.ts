export type PostListingPageConfig = {
	base_path?: string;
	post_type?: string;
	posts_per_page?: number;
	taxonomies?: any[];
	pagination_type?: "load_more" | "numbered";
	selectedTaxonomies?: any[];
};

export const postListingPages: PostListingPageConfig[] = [
	{
		base_path: "/resources/",
		post_type: "post",
		posts_per_page: 8,
		pagination_type: "numbered",
		taxonomies: [
			{
				url: "category",
				taxonomy_name: "category",
				prepend_all_term: true,
			},
		],
	},
	// {
	// 	base_path: "/customer-stories/",
	// 	post_type: "customer_story",
	// 	posts_per_page: 6,
	// pagination_type: "load_more",
	// },
];

export default null;
