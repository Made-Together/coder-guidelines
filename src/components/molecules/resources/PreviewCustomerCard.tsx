// import WpImage from "~/components/elements/media/WpImage";

import Link from "next/link";

function PreviewCustomerCard({ post_title, featured_image, permalink }) {
	if (!permalink) return null;

	return (
		<article className="group relative flex flex-col items-start justify-between">
			<div className="relative aspect-[384/252] w-full overflow-hidden rounded-2xl bg-black/20">
				{/* {featured_image?.src && <WpImage image={featured_image} className="object-cover" />} */}
			</div>
			<div className="p-5">
				<h3 className="mt-3 text-[1rem] md:mt-5">
					<Link href={permalink}>
						<span className="absolute inset-0" />
						{post_title}
					</Link>
				</h3>
			</div>
		</article>
	);
}

export default PreviewCustomerCard;
