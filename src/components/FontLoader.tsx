import { useEffect, useState } from "react";

export default function FontLoader() {
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadFonts() {
			try {
				const response = await fetch("/api/font-faces");

				if (!response.ok) {
					if (response.status === 404) {
						console.warn("No fonts found");
						return;
					}
					throw new Error(`Failed to load fonts: ${response.statusText}`);
				}

				const css = await response.text();
				if (!css) {
					console.warn("No font faces returned");
					return;
				}

				// Create and inject style element
				const style = document.createElement("style");
				style.setAttribute("data-font-faces", "");
				style.textContent = css;
				document.head.appendChild(style);

				return () => {
					document.head.removeChild(style);
				};
			} catch (err) {
				const message = err instanceof Error ? err.message : "Failed to load fonts";
				console.error(message);
				setError(message);
			}
		}

		loadFonts();
	}, []);

	// Component doesn't need to render anything
	return null;
}
