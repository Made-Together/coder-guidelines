export type SectionProps = {
	components?: any[];
	id?: string;
	classnames?: string;
	inner_spacing?: string;
	has_container?: boolean;
	overflow?: boolean;
	background?: {
		background_color?: string;
	};
	padding_top?: string;
	padding_bottom?: string;
	is_rounded?: boolean;
	rounded_options?: {
		has_inner_container?: boolean;
		inner_background_color?: string;
		inner_padding_top?: string;
		inner_padding_bottom?: string;
	};
};

export type WpLinkType = {
	title?: string;
	url?: string;
	target?: string;
};

export type WpPostTypes = "page" | "post";

export type WpPage = {
	ID: number;
	post_author: string | number;
	post_date: string;
	post_date_gmt: string;
	post_modified: string;
	post_modified_gmt: string;
	post_content: string;
	post_title: string;
	post_excerpt: string;
	post_status: "draft" | "publish";
	post_password?: string;
	post_name: string;
	post_parent: string;
	guid: string;
	menu_order: number;
	post_type: WpPostTypes;
	url: string;
	flexible_content: FlexibleContent[];
	sections: FlexibleContent[];
	seo: WpSeo;
};

export type WpSeo = {
	title?: string;
	description?: string;
	indexable?: string;
	image: any;
};

export type WpHeaderNav = {
	items: {
		link: WpLinkType;
	}[];
};

export type WpFooterNav = {
	items: {
		link: WpLinkType;
	}[];
};

export type WpOptions = {
	header_nav?: WpHeaderNav;
	footer_nav?: WpFooterNav;
};

export type FlexibleContent = {
	acf_fc_layout: "section" | "landing_page";
	landing_page: any;
	section: SectionProps;
};

export type WpRedirect = {
	source: string;
	destination: string;
	type: string;
};

export type WpSearchRequest = {
	query: string;
	postType?: string;
	perPage?: number;
};
