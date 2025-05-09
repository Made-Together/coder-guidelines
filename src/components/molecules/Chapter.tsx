import Image from "next/image";
import Link from "next/link";
import DownloadButton from "~/components/atoms/DownloadButton";

type ChapterItem = {
	heading: string;
	id: string;
};

type ChapterProps = {
	heading: string;
	sectionNumber: number;
	items: ChapterItem[];
	downloadFile?: string;
	downloadText?: string;
};

// Consistent slugify function - matches the one in Guidelines.tsx
const slugify = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

export default function Chapter({ heading, sectionNumber, items, downloadFile, downloadText }: ChapterProps) {
	// Extract the original filename from the path
	const fileName = downloadFile ? downloadFile.split("/").pop() : "";

	return (
		<div className="mb:mb-32 md:px-6">
			<div className="bg-core px-6 py-12 text-white dark:bg-white/10 md:rounded-default md:px-20 md:py-32">
				<div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-8 md:grid-cols-2">
					<div className="flex flex-col gap-4 md:justify-between md:gap-8">
						<h2 className="font-headings text-2xl font-medium md:max-w-xs md:text-6xl">{heading}</h2>
						{downloadFile && <DownloadButton downloadFile={downloadFile} downloadText={downloadText} className="" />}
					</div>
					<ul className="space-y-2 text-[15px]">
						{items.map((item, index) => (
							<li key={item.id}>
								<Link href={`#${item.id}`} className="font-accent group flex items-center gap-4 md:inline-flex" scroll={false}>
									<span className="opacity-50">
										{sectionNumber}.{index + 1}
									</span>
									<span className="transition-transform duration-200 md:group-hover:translate-x-2">{item.heading}</span>
									<span className="ml-auto opacity-50 md:hidden">→</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
