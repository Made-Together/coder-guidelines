import { useResourceContext } from "~/contexts/ResourceContext";
import dynamic from "next/dynamic";

const PreviewPostCard = dynamic(() => import("~/components/molecules/resources/PreviewPostCard"));
const PreviewCustomerCard = dynamic(() => import("~/components/molecules/resources/PreviewCustomerCard"));

function ResourceList() {
	const { listingContext, postsToShow, searchResults, searchTerm } = useResourceContext();

	const { post_type } = listingContext || {};

	if (postsToShow?.length === 0) {
		return <div className="text-h5 font-heading container pb-8 md:pb-[110px]">No stories found</div>;
	}
	if (searchTerm !== "" && searchResults?.length === 0) {
		return <div className="text-h5 font-heading container pb-8 md:pb-[110px]">No stories found for {searchTerm}.</div>;
	}

	return (
		<div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
			{(searchTerm !== "" ? searchResults : postsToShow).map((post) => {
				if (post_type === "customer") return <PreviewCustomerCard {...post} key={`post-${post.ID}`} />;

				return <PreviewPostCard {...post} key={`post-${post.ID}`} />;
			})}
		</div>
	);
}

export default ResourceList;
