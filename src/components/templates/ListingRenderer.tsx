import ResourceContext from "~/contexts/ResourceContext";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ResourcesIndex = dynamic(() => import("~/components/templates/ResourcesIndex"));

function ListingRenderer({ listingContext }) {
	const { taxonomies, base_path, posts = [] } = listingContext || {};

	const [postsToShow, setPostsToShow] = useState(posts);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	useEffect(() => {
		setPostsToShow(posts);
	}, [posts]);

	// This will need to be changed in the backend
	const resourcePath = taxonomies ? `${base_path}${Object.keys(taxonomies)[0]}/${Object.values(taxonomies)[0]}/` : base_path;

	function getListingComponent(response) {
		if (!response) return null;

		if (response.taxonomies?.category || response.post_type === "post" || response.post_type === "customer") {
			return <ResourcesIndex />;
		}

		return null;
	}

	const contextValue = {
		listingContext,
		resourcePath,
		postsToShow,
		setPostsToShow,
		searchTerm,
		setSearchTerm,
		searchResults,
		setSearchResults,
		hideCategories: listingContext?.post_type === "customer",
	};

	return <ResourceContext.Provider value={contextValue}>{getListingComponent(listingContext)}</ResourceContext.Provider>;
}

export default ListingRenderer;
