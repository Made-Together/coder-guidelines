import LayoutRenderer from "~/components/templates/LayoutRenderer";
import React from "react";

import type { WpPage } from "~/types/wp";

export default function Page({ page }: { page: WpPage }) {
	return <LayoutRenderer {...page} />;
}
