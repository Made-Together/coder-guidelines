// import WpImage from "~/components/elements/media/WpImage";

import Link from "next/link";

function PreviewPostCard({ post_title, featured_image, permalink, post_date_gmt, read_time }) {
	if (!permalink) return null;
	return (
		<article className="group relative flex flex-col items-start justify-between">
			<div className="relative aspect-[384/252] w-full overflow-hidden rounded-[20px] bg-black/20">
				{/* {featured_image?.src && <WpImage image={featured_image} className="object-cover" fill />} */}
			</div>
			<div className="p-5">
				<div className="text-[0.875rem] text-black/70">
					{post_date_gmt && <time dateTime={post_date_gmt}>{post_date_gmt}</time>}
					{read_time > 0 && <span> / {read_time} min read</span>}
				</div>

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

export default PreviewPostCard;
