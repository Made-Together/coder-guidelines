import Image from "next/image";

type FooterProps = {
	image: string;
	alt: string;
	width: number;
	height: number;
	copyright: string;
	credit: {
		text: string;
		link: {
			text: string;
			url: string;
		};
	};
};

export default function Footer({ image, alt, width, height, copyright, credit }: FooterProps) {
	return (
		<div className="relative w-full overflow-hidden">
			<Image src={image} className="h-full w-full object-cover" alt={alt} width={width} height={height} />
			<div className="absolute bottom-0 left-0 w-full pb-16">
				<div className="mx-auto max-w-[1140px] justify-between text-[12px] font-medium uppercase tracking-wider max-md:text-center md:flex md:px-12">
					<p className="max-md:hidden">
						© {new Date().getFullYear()} {copyright}
					</p>
					<p className="">
						Made {""}
						<a className="hover:underline" href="https://together.agency" target="_blank" rel="noreferrer">
							Together
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
