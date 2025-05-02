import Link, { LinkProps } from "~/components/atoms/links/Link";
import React from "react";
import clsx from "clsx";

export type LinkGroupProps = {
	links: LinkProps[];
	className?: string;
};

function LinkGroup({ links, className = "" }: LinkGroupProps) {
	return (
		<div className={clsx("max-xs:flex-col xs:items-center flex gap-x-2 gap-y-3", className)}>
			{links?.map(({ link }, i) => <Link {...link} className={links.length > 1 ? "w-full md:w-auto" : ""} key={`linkgroupitem${i}`} />)}
		</div>
	);
}

export default LinkGroup;
