import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type TwoColImagesBlock = {
	title: string;
	image?: string;
	video?: string;
	file?: string;
};

type TwoColImagesProps = {
	images: TwoColImagesBlock[];
};

export default function TwoColImages({ images }: TwoColImagesProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{images.map((image, index) => (
				<div key={index} className="">
					{image.title && <p className="font-accent mb-6 text-[12px] font-medium uppercase dark:text-white">{image.title}</p>}
					<div className="relative aspect-[485/400] overflow-hidden rounded-default border border-black/5 dark:border-white/10">
						{image.video ? (
							<video className="h-full w-full object-cover" autoPlay playsInline loop muted preload="metadata">
								<source src={image.video} type="video/mp4" />
								<track kind="captions" />
								Your browser does not support the video tag.
							</video>
						) : (
							<Image src={image.image || ""} alt={image.title} layout="fill" objectFit="cover" />
						)}
						{image.file && (
							<Link href={image.file} className="absolute bottom-4 right-4 flex h-6 w-6 items-center justify-center rounded-default bg-accent text-white">
								<Download size={16} />
							</Link>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
