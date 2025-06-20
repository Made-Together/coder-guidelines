import { format } from "date-fns";
import { useEffect, useState } from "react";
import Header from "~/components/organisms/global/Header";
import Footer from "~/components/molecules/Footer";
import { motion } from "framer-motion";
import Masthead from "~/components/molecules/Masthead";
import Chapter from "~/components/molecules/Chapter";
import Section, { type SectionContent } from "~/components/molecules/Section";
import Seo from "~/components/organisms/global/Seo";

// Consistent slugify function
const slugify = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

type ChapterSection = {
	content: SectionContent[];
	spacing?: "default" | "small";
};

type ChapterType = {
	heading?: string;
	sections: ChapterSection[];
	slug: string;
	downloadFile?: string;
	downloadText?: string;
};

type GlobalConfig = {
	masthead: {
		image: string;
		alt: string;
	};
	footer: {
		image: string;
		alt: string;
	};
	logo: string;
	favicon?: string;
	seo: {
		title: string;
		description: string;
		url: string;
		image: string;
	};
};

type GuidelinesProps = {
	chapters: ChapterType[];
	global: GlobalConfig;
};

// Default global configuration
const defaultGlobal: GlobalConfig = {
	masthead: {
		image: "/hero.svg",
		alt: "Masthead",
	},
	footer: {
		image: "/footer.svg",
		alt: "Footer",
	},
	logo: "/images/logo.svg",
	favicon: "/favicon.png",
	seo: {
		title: "Brand Guidelines",
		description: "Visual identity guidelines",
		url: "https://brand.silnahealth.com",
		image: "/seo.jpg",
	},
};

// Hardcoded footer values
const footerDefaults = {
	width: 1400,
	height: 1400,
	copyright: "Brand Guidelines",
	credit: {
		text: "Made",
		link: {
			text: "Together",
			url: "https://together.agency",
		},
	},
};

export default function Guidelines({ chapters, global }: GuidelinesProps) {
	const [options, setOptions] = useState<any>(null);
	const deploymentDate = format(new Date(), "MMMM d, yyyy");

	// Merge default values with provided global config
	const mergedGlobal = {
		...defaultGlobal,
		...global,
		masthead: {
			...defaultGlobal.masthead,
			...global?.masthead,
		},
		footer: {
			...defaultGlobal.footer,
			...global?.footer,
		},
		seo: {
			...defaultGlobal.seo,
			...global?.seo,
			favicon: global?.favicon || defaultGlobal.favicon,
		},
	};

	return (
		<div className="relative flex min-h-screen flex-col">
			<Seo page={{} as any} seo={{ ...mergedGlobal.seo, favicon: mergedGlobal.favicon }} />
			<Header deploymentDate={deploymentDate} logo={mergedGlobal.logo} chapters={chapters} global={mergedGlobal} />
			<main className="relative flex-1 bg-white dark:bg-[#000] md:pl-[300px]">
				<Masthead {...mergedGlobal.masthead} />
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						type: "spring",
						stiffness: 200,
						damping: 30,
						mass: 0.5,
					}}
					className="relative"
				>
					{chapters?.map((chapter, index) => {
						const items = chapter.sections.flatMap((section) =>
							section.content
								.filter((item): item is Extract<SectionContent, { discriminant: "intro" }> => item.discriminant === "intro")
								.filter((item) => item.value.heading) // Only include items with headings
								.map((item) => ({
									heading: item.value.heading,
									id: `${index + 1}-${slugify(item.value.heading!)}`,
								}))
						);

						return (
							<div key={index} id={chapter.slug}>
								<Chapter
									heading={chapter.heading}
									sectionNumber={index + 1}
									items={items}
									downloadFile={chapter.downloadFile}
									downloadText={chapter.downloadText}
								/>
								{chapter.sections.map((section, sectionIndex) => (
									<Section key={`${index}-${sectionIndex}`} content={section.content} chapterNumber={index + 1} spacing={section.spacing} />
								))}
							</div>
						);
					})}
				</motion.div>
				<Footer image={mergedGlobal.footer.image} alt={mergedGlobal.footer.alt} {...footerDefaults} />
			</main>
		</div>
	);
}
