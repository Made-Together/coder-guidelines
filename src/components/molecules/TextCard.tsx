import LinkGroup, { LinkGroupProps } from "~/components/molecules/LinkGroup";
import React from "react";
import clsx from "clsx";

export type TextCardProps = {
	subheading?: string;
	heading?: string;
	content?: string;
	links?: LinkGroupProps["links"];
	options?: {
		max_width?: string;
		text_alignment?: "left" | "center" | "right";
		has_mobile_text_alignment?: boolean;
		mobile_text_alignment?: "left" | "center" | "right";
		section_alignment?: "left" | "center" | "right";
		subheading_tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
		subheading_font_size?: string;
		subheading_classes?: string;
		heading_tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
		heading_font_size?: string;
		heading_classes?: string;
		heading_max_width?: string;
		content_max_width?: string;
		content_classes?: string;
		custom_y_spacing?: string;
		mobile_section_alignment?: string;
	};
};

const ySpacings = {
	h1: "space-y-6",
	h2: "space-y-5",
	h3: "space-y-3",
};

function TextCard({
	subheading = "",
	heading = "",
	content = "",
	links = [],
	options: {
		max_width = "",
		text_alignment = "left",
		has_mobile_text_alignment = false,
		mobile_text_alignment = "left",
		section_alignment = "left",
		subheading_tag = "h6",
		subheading_font_size = "default",
		subheading_classes = "",
		heading_tag = "h2",
		heading_font_size = "default",
		heading_classes = "",
		heading_max_width = "",
		content_max_width = "",
		content_classes = "",
		custom_y_spacing = "",
		mobile_section_alignment = "",
	} = {},
}: TextCardProps) {
	const HeadingTag = (heading_tag as keyof React.JSX.IntrinsicElements) || "h2";
	const headingFontSize = heading_font_size === "default" ? HeadingTag : heading_font_size;

	const SubheadingTag = (subheading_tag as keyof React.JSX.IntrinsicElements) || "h6";
	const subheadingFontSize = subheading_font_size === "default" ? SubheadingTag : subheading_font_size;

	const hasLinks = links?.length > 0 && links[0]?.link?.link?.url?.length > 0;

	const ySpacing = custom_y_spacing || ySpacings[headingFontSize] || "space-y-2";

	const flexItemAlignmentClasses = clsx(text_alignment === "center" ? "items-center" : text_alignment === "right" ? "items-end" : "items-start");

	const sectionAlignmentClasses = clsx(section_alignment === "center" ? "md:items-center" : section_alignment === "right" ? "items-end" : "items-start");

	return (
		<div className={clsx("flex w-full flex-col", mobile_section_alignment, sectionAlignmentClasses)}>
			<div
				className={clsx(
					"text-card flex flex-col",
					flexItemAlignmentClasses,
					ySpacing,
					`text-${has_mobile_text_alignment ? mobile_text_alignment : text_alignment}`,
					`md:text-${text_alignment} md:${max_width}`
				)}
			>
				{subheading && (
					<SubheadingTag className={clsx("w-full", `text-${subheadingFontSize}`, subheading_classes)} dangerouslySetInnerHTML={{ __html: subheading }} />
				)}
				{heading && (
					<HeadingTag
						className={clsx("text-card w-full", heading_classes, `text-${headingFontSize}`, `md:${heading_max_width}`)}
						dangerouslySetInnerHTML={{
							__html: heading,
						}}
					/>
				)}
				{content && <div className={clsx("prose w-full", content_classes, `md:${content_max_width}`)} dangerouslySetInnerHTML={{ __html: content }} />}

				{hasLinks && <LinkGroup links={links} className={headingFontSize === "h1" ? "md:pt-4" : "pt-2"} />}
			</div>
		</div>
	);
}

export default TextCard;
