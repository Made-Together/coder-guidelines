import Guidelines from "~/components/organisms/Guidelines";
import { promises as fs } from "fs";
import path from "path";
import yaml from "js-yaml";

type ChapterData = {
	heading: string;
	slug: string;
	order: number;
	sections: Array<{
		content: any[];
		spacing?: "default" | "small";
	}>;
};

type Props = {
	chapters: ChapterData[];
	global: {
		masthead: {
			image: string;
			alt: string;
		};
		footer: {
			image: string;
			alt: string;
		};
		logo: string;
		seo: {
			title: string;
			description: string;
			url: string;
			image: string;
		};
	};
};

export default function Home({ chapters, global }: Props) {
	return <Guidelines chapters={chapters} global={global} />;
}

export async function getStaticProps() {
	// Read files directly during build time
	const contentDir = path.join(process.cwd(), "content");

	const [chaptersData, globalData] = await Promise.all([
		fs.readdir(path.join(contentDir, "chapters")).then(async (files) => {
			const chapterFiles = files.filter((file) => file.endsWith(".yaml"));
			const chapters = await Promise.all(
				chapterFiles.map(async (file) => {
					const content = await fs.readFile(path.join(contentDir, "chapters", file), "utf8");
					return yaml.load(content) as ChapterData;
				})
			);
			// Sort chapters by order field
			return chapters.sort((a, b) => a.order - b.order);
		}),
		fs.readFile(path.join(contentDir, "global.yaml"), "utf8").then((content) => yaml.load(content)),
	]);

	return {
		props: {
			chapters: chaptersData,
			global: globalData,
		},
		revalidate: 60, // Revalidate every minute
	};
}
