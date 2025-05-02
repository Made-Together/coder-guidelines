import { useResourceContext } from "~/contexts/ResourceContext";
import dynamic from "next/dynamic";

const PAGINATION_COMPONENTS = {
	numbered: dynamic(() => import("~/components/molecules/resources/Numbered")),
	load_more: dynamic(() => import("~/components/molecules/resources/LoadMore")),
};

function PaginationType() {
	const { listingContext, searchTerm } = useResourceContext();

	if (!listingContext?.pagination_type) return null;
	if (searchTerm !== "") return null;
	const Component = PAGINATION_COMPONENTS[listingContext.pagination_type];
	return <Component />;
}

export default PaginationType;
