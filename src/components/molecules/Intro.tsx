import Image from "next/image";
import Link from "next/link";
import DownloadButton from "~/components/atoms/DownloadButton";

type ChapterItem = {
	heading?: string;
};

type IntroProps = {
	heading?: string;
	content: string;
	sectionNumber: string;
	downloadFile?: string;
	downloadText?: string;
};

export default function Intro({ heading, content, sectionNumber, downloadFile, downloadText }: IntroProps) {
	// If no heading, just render the content without grid
	if (!heading) {
		return (
			<div className="dark:text-white">
				<p className="prose whitespace-pre-wrap leading-[1.4] opacity-80 md:prose-lg" dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		);
	}

	// Render with grid when heading is provided
	return (
		<div className="grid gap-2 dark:text-white md:grid-cols-2 md:gap-8">
			<div className="flex flex-col gap-2 md:justify-between">
				<p className="text-[20px] font-medium">
					<span className="text-secondaries-orchid mr-2">{sectionNumber}</span>
					<span className="font-medium">{heading}</span>
				</p>
				{downloadFile && <DownloadButton downloadFile={downloadFile} downloadText={downloadText} />}
			</div>
			<div>
				<p className="prose whitespace-pre-wrap leading-[1.4] opacity-80 md:prose-lg" dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	);
}
