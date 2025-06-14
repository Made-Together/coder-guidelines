import Image from "next/image";
import Link from "next/link";

type FullWidthImageProps = {
	image?: string;
	video?: string;
};

export default function FullWidthImage({ image, video }: FullWidthImageProps) {
	// console.log(video);
	return (
		<div className="im relative aspect-[990/640] overflow-hidden rounded-default border border-black/5 dark:border-white/10">
			{video ? (
				<video className="h-full w-full object-cover" autoPlay playsInline loop muted preload="metadata">
					<source src={video} type="video/mp4" />
					<track kind="captions" />
					Your browser does not support the video tag.
				</video>
			) : (
				<Image src={image || ""} alt="Full width image" fill className="object-cover" />
			)}
		</div>
	);
}
