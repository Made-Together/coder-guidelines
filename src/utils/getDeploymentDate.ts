import { format } from "date-fns";

// Cache the formatted date
let formattedDate: string;

export default function getDeploymentDate() {
	if (formattedDate) return formattedDate;

	// Use the build-time environment variable
	const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString();
	formattedDate = format(new Date(buildDate), "MMMM d, yyyy");

	return formattedDate;
}
