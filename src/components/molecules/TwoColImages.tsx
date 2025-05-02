import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type TwoColImagesBlock = {
	title: string;
	image: string;
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
					{image.title && <p className="mb-6 text-[12px] font-medium uppercase dark:text-white">{image.title}</p>}
					<div className="rounded-default relative aspect-[485/400] overflow-hidden border border-black/5 dark:border-white/10">
						<Image src={image.image} alt={image.title} layout="fill" objectFit="cover" />
						{image.file && (
							<Link href={image.file} className="rounded-default bg-accent absolute bottom-4 right-4 flex h-6 w-6 items-center justify-center text-white">
								<Download size={16} />
							</Link>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
