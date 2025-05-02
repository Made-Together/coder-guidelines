import cms from "~/cms";
import { useResourceContext } from "src/contexts/ResourceContext";
import Label from "~/components/atoms/forms/Label";
import Input from "~/components/atoms/forms/Input";
import { useState, useDeferredValue, useEffect } from "react";

function SearchResources() {
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);
	const { setSearchResults, setSearchTerm } = useResourceContext();

	const handleSearchChange = (e) => {
		const newValue = e.target.value;
		if (newValue === "") {
			setSearchResults([]);
			setSearchTerm("");
			return;
		}
		setQuery(newValue);
	};

	useEffect(() => {
		if (deferredQuery.trim()) {
			const getPosts = async () => {
				const results = await cms.search({ query: deferredQuery });
				setSearchResults([...results]);
				setSearchTerm(deferredQuery);
			};

			getPosts();
		}
	}, [deferredQuery]);

	return (
		<div>
			<Label label="Search" id="search" />
			<div className="mt-2">
				<Input id="search" type="text" placeholder="Search" handleOnChange={handleSearchChange} />
			</div>
		</div>
	);
}

export default SearchResources;
