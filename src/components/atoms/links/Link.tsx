import Button from "~/components/atoms/links/Button";
import TextLink from "~/components/atoms/links/TextLink";
import { WpLinkType } from "~/types/wp";
import React from "react";
import NextLink from "next/link";
import clsx from "clsx";

export type LinkProps = {
	link?: WpLinkType & {
		link?: WpLinkType;
	};
	type?: string;
	href?: string;
	to?: string;
	target?: string;
	children?: React.ReactNode;
	className?: string;
	rel?: string;
};

function Link(props: LinkProps) {
	const { link, type, href, to, target, children, className = "", rel, ...other } = props;
	// get url from either href prop or link.url
	const url = link?.url || href || to || "#";
	const linkTarget = link?.target || target || "";

	const isExternal = determineIfExternal(url);
	const urlPath = formatUrlPath(url, isExternal);

	const secureRel = isExternal && linkTarget === "_blank" ? `noopener noreferrer ${rel || ""}`.trim() : rel;

	const linkClasses = clsx("inline-block", className || "", url.length === 0 || url === "#" ? "pointer-events-none cursor-default" : "");

	return isExternal ? (
		<a href={urlPath} target={link?.target || target || ""} rel={secureRel} {...other} className={linkClasses}>
			<LinkTypeRenderer {...props} />
		</a>
	) : (
		<NextLink href={urlPath} target={link?.target || target || ""} rel={secureRel} {...other} className={linkClasses}>
			<LinkTypeRenderer {...props} />
		</NextLink>
	);
}

export default Link;

function LinkTypeRenderer(props) {
	const { type, link, children } = props;
	return (
		<>
			{!type && !children && link?.title?.length > 0 && <span dangerouslySetInnerHTML={{ __html: link?.title }} />}
			{type === "button" && <Button {...props} />}
			{type === "text" && <TextLink {...props} />}
			{children}
		</>
	);
}

function determineIfExternal(url: string): boolean {
	if (!url) return false;

	return !url.includes(process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL) && (url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:"));
}

function formatUrlPath(url: string, isExternal: boolean): string {
	if (isExternal) return url;

	let urlPath = url.trim().replace(/^[a-zA-Z]{3,5}:\/{2}[a-zA-Z0-9_.:-]+\//, "");
	if (urlPath && !urlPath.startsWith("/") && !urlPath.startsWith("#")) {
		urlPath = `/${urlPath}`;
	}

	return urlPath;
}
