import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ThreeColImagesBlock = {
	title: string;
	content?: string;
	image: string;
	file?: string;
};

type ThreeColImagesProps = {
	images: ThreeColImagesBlock[];
};

export default function ThreeColImages({ images }: ThreeColImagesProps) {
	return (
		<div className="grid grid-cols-2 gap-6 md:grid-cols-3">
			{images.map((image, index) => (
				<div key={index} className="">
					<div className="rounded-default relative aspect-[485/400] overflow-hidden border border-black/5 dark:border-white/10">
						<Image src={image.image} alt={image.title} layout="fill" objectFit="cover" />
						{image.file && (
							<Link href={image.file} className="rounded-default bg-accent absolute bottom-4 right-4 flex h-6 w-6 items-center justify-center text-white">
								<Download size={16} />
							</Link>
						)}
					</div>
					{image.title && (
						<p className="mb-6 mt-6 text-[12px] font-medium uppercase dark:text-white">
							{image.title}
							<br />
							{image.content}
						</p>
					)}
				</div>
			))}
		</div>
	);
}
