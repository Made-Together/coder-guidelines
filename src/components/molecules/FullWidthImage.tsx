import Image from "next/image";
import Link from "next/link";

type FullWidthImageProps = {
	image: string;
};

export default function FullWidthImage({ image }: FullWidthImageProps) {
	return (
		<div className="relative aspect-[990/640] overflow-hidden rounded-default">
			<Image src={image} alt="Full width image" fill className="object-cover" />
		</div>
	);
}
