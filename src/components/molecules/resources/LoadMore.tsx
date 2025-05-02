import getListingPageData from "~/cms/getListingPageData";
import { useResourceContext } from "~/contexts/ResourceContext";
import { useState } from "react";

import { useRouter } from "next/router";

function LoadMore() {
	const router = useRouter();
	const { listingContext, postsToShow, setPostsToShow } = useResourceContext();

	const { page = { current: 1, total: 1 } } = listingContext || {};

	const [currentPage, setCurrentPage] = useState(page.current);

	const isLastPage = currentPage === page.total;

	const nextPageUrl = currentPage >= page.total ? null : `${router.asPath}page/${currentPage + 1}/`;

	const handleLoadMore = async () => {
		if (!nextPageUrl) return;

		try {
			const newPosts = await getListingPageData({ slug: nextPageUrl });
			setPostsToShow([...postsToShow, ...newPosts.posts]);
			setCurrentPage((prevPage) => prevPage + 1);
		} catch (error) {
			console.error("Failed to load more posts:", error);
		}
	};

	return (
		<div>
			{!isLastPage && (
				<div className="mt-10 flex justify-center">
					<button type="button" onClick={handleLoadMore}>
						Load More
					</button>
				</div>
			)}
		</div>
	);
}

export default LoadMore;
