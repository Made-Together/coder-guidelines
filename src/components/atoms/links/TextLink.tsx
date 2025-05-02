import { WpLinkType } from "~/types/wp";
import React from "react";

type TextLinkProps = {
	link?: WpLinkType;
	className?: string;
	children?: React.ReactNode;
	underlineColour?: "black" | "white";
};

function TextLink({ className = "", link, children, underlineColour = "black" }: TextLinkProps) {
	return (
		<div className={`text-16px group inline-flex cursor-pointer select-none items-center leading-tight ${className}`}>
			{(link?.title || children) && (
				<div className="group-hover:text-orange inline-block font-bold text-inherit">
					{link?.title && <span dangerouslySetInnerHTML={{ __html: link?.title }} />}
					{!link?.title && children && children}
					<div className={`group-hover:bg-orange mt-1 h-[2px] w-full rounded bg-black bg-${underlineColour} transition-colors duration-300 ease-in-out`} />
				</div>
			)}
		</div>
	);
}

export default TextLink;
