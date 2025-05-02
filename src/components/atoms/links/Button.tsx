import { WpLinkType } from "~/types/wp";
import clsx from "clsx";
import React from "react";

type ButtonProps = {
	link?: WpLinkType;
	button?: {
		color: "black" | "white";
		size: "small" | "medium" | "wide" | "huge";
		type: "solid" | "outline";
	};
	size?: "small" | "medium" | "wide" | "huge";
	className?: string;
	children?: React.ReactNode;
};

function Button({ link, button, size, className = "", children, ...other }: ButtonProps) {
	const backgroundColor = button?.color || "black";
	const buttonSize = button?.size || "medium";
	const buttonType = button?.type || "solid";

	const classes = clsx(
		"text-white border border-inherit transition-colors duration-300 select-none appearance-none inline-block rounded text-16px px-7 py-3 leading-[1.3] font-medium",
		className,
		backgroundColor === "black" && "bg-black border-black hover:bg-white hover:text-black",
		backgroundColor === "white" && "bg-white border-white hover:bg-white hover:text-black",
		buttonSize === "small" && "inline-block rounded text-13px px-5 py-2 font-medium",
		buttonSize === "wide" && "block rounded-[100px] text-16px px-7 py-5 leading-[1.3] text-center font-bold",
		buttonSize === "huge" && "w-full rounded-[100px] text-16px  py-5 px-5 font-bold cursor-pointer text-center",
		buttonType === "outline" && "bg-transparent border",
		buttonType === "outline" && backgroundColor === "white" && "border-white hover:bg-white hover:text-black",
		buttonType === "outline" && backgroundColor === "black" && "border-black text-black hover:bg-black hover:text-white"
	);

	return link?.title ? (
		<div className={classes} {...other} dangerouslySetInnerHTML={{ __html: link?.title }} />
	) : (
		<div className={classes} {...other}>
			{children}
		</div>
	);
}

export default Button;
