import { Download } from "lucide-react";
import Image from "next/image";

export type IconSetBlock = {
	title: string;
	content?: string;
	image: string;
	isDownloadable?: boolean;
};

type IconSetProps = {
	icons: IconSetBlock[];
};

export default function IconSet({ icons }: IconSetProps) {
	return (
		<div className="grid grid-cols-3 gap-4 md:grid-cols-4 md:gap-6">
			{icons.map((icon, index) => (
				<div key={index} className="">
					<div className="relative flex aspect-[1/1] items-center justify-center overflow-hidden rounded-default border border-black/5 dark:border-white/10">
						<div className="relative h-12 w-12 dark:invert dark:filter md:h-24 md:w-24">
							<Image src={icon.image} alt={icon.title} layout="fill" objectFit="contain" />
						</div>
						{icon.isDownloadable && (
							<a
								href={icon.image}
								className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-default bg-black text-white md:bottom-4 md:right-4"
								download
								aria-label={`Download ${icon.title || "icon"}`}
							>
								<Download size={16} />
							</a>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
