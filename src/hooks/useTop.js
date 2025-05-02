import { useState, useEffect } from "react";
import { useRect } from "@reach/rect";

export default function useTop(ref) {
	const [top, setTop] = useState();
	const rect = useRect(ref);
	const rectTop = rect ? rect.top : undefined;
	useEffect(() => {
		if (typeof rectTop === "undefined") return;
		const newTop = rectTop + window.pageYOffset;
		if (newTop !== top) {
			setTop(newTop);
		}
	}, [rectTop, top]);
	return top;
}
