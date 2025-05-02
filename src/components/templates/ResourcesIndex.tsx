import CategoryList from "~/components/molecules/resources/CategoryList";
import PaginationType from "~/components/molecules/resources/PaginationType";
import { useResourceContext } from "~/contexts/ResourceContext";
import ResourceList from "~/components/organisms/ResourceList";
import SearchResources from "~/components/molecules/resources/SearchResources";

function ResourcesIndex() {
	const { hideCategories } = useResourceContext();

	return (
		<div className="container space-y-24 py-10">
			{!hideCategories && <CategoryList />}
			<SearchResources />
			<ResourceList />
			<PaginationType />
		</div>
	);
}

export default ResourcesIndex;
