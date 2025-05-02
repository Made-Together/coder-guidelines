import { SectionProps, WpPage } from "~/types/wp";
import LandingPage from "~/components/templates/LandingPage";
import Section from "~/components/molecules/Section";
import React from "react";

function LayoutRenderer({ sections, ID }: WpPage) {
	if (!sections) return null;

	return sections?.map((section, i) => (
		<React.Fragment key={`${ID + section.acf_fc_layout + i}`}>{section?.acf_fc_layout === "landing_page" && <LandingPage {...section} />}</React.Fragment>
	));
}

export default LayoutRenderer;
