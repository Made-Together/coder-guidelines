import { createContext, useContext } from "react";

const ResourceContext = createContext(null);

export default ResourceContext;

export function useResourceContext() {
	const context = useContext(ResourceContext);
	if (context === undefined) {
		throw new Error("useResourceContext must be used within a ResourceProvider");
	}
	return context;
}
