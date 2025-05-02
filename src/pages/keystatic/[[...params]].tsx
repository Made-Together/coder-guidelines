import { makePage } from "@keystatic/next/ui/app";
import keystaticConfig from "@/keystatic.config";

// Create the Keystatic page component
export default makePage(keystaticConfig);

// Handle dynamic paths
export async function getStaticPaths() {
	return {
		paths: [],
		fallback: "blocking",
	};
}

// Handle props for each path
export async function getStaticProps({ params }: { params?: { params?: string[] } }) {
	return {
		props: {
			params: params?.params || [],
		},
	};
}
