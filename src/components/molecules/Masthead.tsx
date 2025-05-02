import Image from "next/image";

type MastheadProps = {
	image: string;
	alt: string;
};

export default function Masthead({ image, alt }: MastheadProps) {
	return (
		<div className="relative h-[calc(100vh-400px)] w-full overflow-hidden max-md:mt-24 md:mb-6 md:h-[calc(100vh-200px)]">
			<Image src={image} className="h-full w-full object-cover" alt={alt} loading="eager" layout="fill" objectFit="cover" />
		</div>
	);
}
