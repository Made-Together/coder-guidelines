import ThreeColImages, { ThreeColImagesBlock } from "~/components/molecules/ThreeColImages";
import TwoColImages, { TwoColImagesBlock } from "~/components/molecules/TwoColImages";
import DoDont, { DoDontBlock } from "~/components/molecules/DoDont";
import TextBoxContent from "~/components/molecules/TextBoxContent";
import TextBox from "~/components/molecules/TextBox";
import TwoBoxText from "~/components/molecules/TwoBoxText";
import Values from "~/components/molecules/Values";
import FullWidthImage from "~/components/molecules/FullWidthImage";
import Pitch from "~/components/molecules/Pitch";
import Eyebrow from "~/components/molecules/Eyebrow";
import Intro from "~/components/molecules/Intro";
import Colours, { ColoursBlock } from "~/components/molecules/Colours";
import IconSet, { IconSetBlock } from "~/components/molecules/IconSet";
import FontDisplay from "~/components/molecules/FontDisplay";
import { ReactNode } from "react";
import clsx from "clsx";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import type { Config } from "tailwindcss";

const fullConfig = resolveConfig(tailwindConfig as unknown as Config);
const colors = fullConfig.theme?.colors as Record<string, any>;

// Helper function to generate color blocks from Tailwind config
const generateColorBlocks = (colorGroup: Record<string, any>) => {
	if (!colorGroup) {
		console.warn("No color group provided");
		return [];
	}

	return Object.entries(colorGroup).map(([name, value]) => ({
		title: name.charAt(0).toUpperCase() + name.slice(1),
		colour: value.hex || value,
		cmyk: value.cmyk,
		pantone: value.pantone,
	}));
};

// Helper function to safely get color group
const getColorGroup = (groupName: string) => {
	const group = colors[groupName];
	if (!group) {
		console.warn(`Color group "${groupName}" not found in Tailwind config`);
		return [];
	}
	return generateColorBlocks(group);
};

// Consistent slugify function - matches the one in Guidelines.tsx
const slugify = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

type BaseContent<T extends string, V> = {
	discriminant: T;
	value: V;
};

type IntroContent = BaseContent<
	"intro",
	{
		heading?: string;
		content: string;
		downloadFile?: string;
		downloadText?: string;
	}
>;

type PitchContent = BaseContent<
	"pitch",
	{
		content: string;
	}
>;

type EyebrowContent = BaseContent<
	"eyebrow",
	{
		content: string;
	}
>;

type FullWidthImageContent = BaseContent<
	"fullWidthImage",
	{
		image: string;
		file?: string;
		video?: string;
	}
>;

type ValuesContent = BaseContent<
	"values",
	{
		values: Array<{
			heading: string;
			content: string;
		}>;
	}
>;

type TwoBoxTextContent = BaseContent<
	"twoBoxText",
	{
		block_1_title: string;
		block_1: Array<{ title: string }>;
		block_2_title: string;
		block_2: Array<{ title: string }>;
	}
>;

type TextBlockContent = BaseContent<
	"textBox",
	{
		blocks: Array<{ title: string }>;
	}
>;

type TextBoxWithContentContent = BaseContent<
	"textBoxContent",
	{
		blocks: Array<{
			title: string;
			content: string;
		}>;
	}
>;

type DoDontContent = BaseContent<
	"doDont",
	{
		right: Array<{
			heading: string;
			content: string;
		}>;
		wrong: Array<{
			heading: string;
			content: string;
		}>;
	}
>;

type TwoColImagesContent = BaseContent<
	"twoColImages",
	{
		images: Array<{
			title: string;
			image: string;
			file?: string;
		}>;
	}
>;

type ThreeColImagesContent = BaseContent<
	"threeColImages",
	{
		images: Array<{
			title: string;
			content: string;
			image: string;
			file?: string;
		}>;
	}
>;

type ColoursContent = BaseContent<
	"colours",
	{
		colourGroup: "primaries" | "secondaries" | "tertiaries" | "accents";
	}
>;

type FontDisplayContent = BaseContent<
	"fontDisplay",
	{
		type: "headings" | "body" | "google";
		backgroundColour: string;
		textColour: string;
	}
>;

type IconSetContent = BaseContent<
	"iconSet",
	{
		icons: Array<{
			title: string;
			content?: string;
			image: string;
			file?: string;
		}>;
	}
>;

export type SectionContent =
	| IntroContent
	| PitchContent
	| EyebrowContent
	| FullWidthImageContent
	| ValuesContent
	| TwoBoxTextContent
	| TextBlockContent
	| TextBoxWithContentContent
	| DoDontContent
	| TwoColImagesContent
	| ThreeColImagesContent
	| ColoursContent
	| FontDisplayContent
	| IconSetContent;

export default function Section({
	content,
	chapterNumber,
	spacing = "default",
}: {
	content: SectionContent[];
	chapterNumber: number;
	spacing?: "default" | "small";
}) {
	return (
		<div className="border-b border-black/5 py-20 dark:border-white/10 max-md:px-6 md:mx-6 md:mb-32 md:px-20 md:py-32">
			<div className={`mx-auto max-w-[1140px] ${spacing === "small" ? "space-y-8 md:space-y-16" : "space-y-20 md:space-y-32"}`}>
				{content.map((block, index) => {
					const key = `${chapterNumber}-${index}`;
					let introIndex = content.slice(0, index + 1).filter((item) => item.discriminant === "intro").length;

					switch (block.discriminant) {
						case "intro":
							const id = block.value.heading ? `${chapterNumber}-${slugify(block.value.heading)}` : `${chapterNumber}-intro-${introIndex}`;
							return (
								<div key={key} id={id}>
									<Intro
										heading={block.value.heading}
										content={block.value.content}
										sectionNumber={`${chapterNumber}.${introIndex}`}
										downloadFile={block.value.downloadFile}
										downloadText={block.value.downloadText}
									/>
								</div>
							);
						case "pitch":
							return <Pitch key={key} content={block.value.content} />;
						case "eyebrow":
							return <Eyebrow key={key} content={block.value.content} />;
						case "fullWidthImage":
							return <FullWidthImage key={key} image={block.value.image} video={block.value.video} />;
						case "values":
							return <Values key={key} values={block.value.values} />;
						case "twoBoxText":
							return (
								<TwoBoxText
									key={key}
									block_1_title={block.value.block_1_title}
									block_1={block.value.block_1}
									block_2_title={block.value.block_2_title}
									block_2={block.value.block_2}
								/>
							);
						case "textBox":
							return <TextBox key={key} blocks={block.value.blocks} />;
						case "textBoxContent":
							return <TextBoxContent key={key} blocks={block.value.blocks} />;
						case "doDont":
							return <DoDont key={key} right={block.value.right} wrong={block.value.wrong} />;
						case "twoColImages":
							return <TwoColImages key={key} images={block.value.images} />;
						case "threeColImages":
							return <ThreeColImages key={key} images={block.value.images} />;
						case "colours":
							return <Colours key={key} colours={getColorGroup(block.value.colourGroup)} />;
						case "fontDisplay":
							return <FontDisplay key={key} type={block.value.type} backgroundColour={block.value.backgroundColour} textColour={block.value.textColour} />;
						case "iconSet":
							return <IconSet key={key} icons={block.value.icons} />;
						default:
							return null;
					}
				})}
			</div>
		</div>
	);
}
