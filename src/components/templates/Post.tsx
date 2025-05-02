import React from "react";
import type { WpPage } from "~/types/wp";

export default function Post({ page }: { page: WpPage }) {
	const { post_title, post_content } = page;

	return (
		<>
			{/* Example post page */}
			<section>
				<div className="container">
					<h1 className="text-h1 mb-12" dangerouslySetInnerHTML={{ __html: post_title }} />
					<div className="prose" dangerouslySetInnerHTML={{ __html: post_content }} />
				</div>
			</section>
		</>
	);
}
