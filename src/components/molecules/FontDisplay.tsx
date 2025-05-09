"use client";

import getFontInfo from "~/utils/typography";
import { useEffect, useState } from "react";

type FontDisplayProps = {
	type: "headings" | "body" | "google" | "accent" | "google2";
	backgroundColour: string;
	textColour: string;
};

type FontInfo = {
	family: string;
	weights: string[];
};

export type FontDisplayContent = {
	type: "fontDisplay";
	fontType: "headings" | "body" | "google" | "accent" | "google2";
	backgroundColour: string;
	textColour: string;
	id?: string;
};

// Map weight names to Tailwind classes
const weightMap: Record<string, string> = {
	thin: "font-thin",
	extralight: "font-extralight",
	light: "font-light",
	regular: "font-normal",
	medium: "font-medium",
	semibold: "font-semibold",
	bold: "font-bold",
	extrabold: "font-extrabold",
	black: "font-black",
};

export default function FontDisplay({ type, backgroundColour, textColour }: FontDisplayProps) {
	const [fontInfo, setFontInfo] = useState<FontInfo | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadFontInfo = async () => {
			try {
				const info = await getFontInfo();
				setFontInfo(info[type]);
			} catch (error) {
				console.error("Error loading font info:", error);
			} finally {
				setLoading(false);
			}
		};

		loadFontInfo();
	}, [type]);

	if (loading) {
		return <div>Loading font information...</div>;
	}

	if (!fontInfo) {
		return <div>No font information available</div>;
	}

	const fontFamilyClass =
		type === "headings"
			? "font-headings"
			: type === "body"
				? "font-body"
				: type === "accent"
					? "font-accent"
					: type === "google2"
						? "font-google2"
						: "font-google";

	const getWeightClass = (weight: string) => {
		const normalizedWeight = weight.toLowerCase();
		return weightMap[normalizedWeight] || "font-normal";
	};

	return (
		<div className={`grid grid-cols-1 gap-6 overflow-hidden rounded-default p-6 md:gap-10 md:p-16 ${backgroundColour} ${textColour}`}>
			<div>
				<p className="mb-2 font-body text-[12px] font-medium uppercase tracking-wider opacity-50 md:text-[14px]">Typeface</p>
				<h2 className={`text-[80px] font-medium leading-[1] ${fontFamilyClass}`}>{fontInfo.family}</h2>
			</div>
			<div>
				<p className="mb-2 font-body text-[12px] font-medium uppercase tracking-wider opacity-50 md:text-[14px]">Weights</p>
				<div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-6">
					{fontInfo.weights.map((weight) => (
						<span key={weight} className={`text-[20px] md:text-[calc(100cqw/56)] ${fontFamilyClass} ${getWeightClass(weight)}`}>
							{weight}
						</span>
					))}
				</div>
			</div>

			<div className="typeface space-y-2">
				<p className="mb-2 font-body text-[12px] font-medium uppercase tracking-wider opacity-50 md:text-[14px]">Glyphs</p>
				<p className={`w-full break-words text-[18px] leading-[1.2] md:text-[calc(100cqw/32)] ${fontFamilyClass}`}>
					AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
					<br />
					1234567890
				</p>
			</div>
		</div>
	);
}
