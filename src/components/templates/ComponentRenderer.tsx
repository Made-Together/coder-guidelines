import TextCard from "~/components/molecules/TextCard";
import TestComponent from "~/components/organisms/TestComponent";
import FaqsAccordion from "~/components/organisms/FaqsAccordion";
import React from "react";

const componentMap = {
	test_component: TestComponent,
	text_card: (props) => <TextCard {...props.text_card} />,
	faqs_accordion: FaqsAccordion,
};

function ComponentRenderer({ components = [], pageId = null }) {
	return components.map((layout, i) => {
		const layoutName = layout.acf_fc_layout;
		const Component = componentMap[layoutName];

		if (!Component) {
			// eslint-disable-next-line no-console
			console.warn(`We don't have a component for: ${layoutName}, either add one or remove from the component map`);
			return null;
		}

		return <Component key={`${pageId}-${layoutName}-${i}`} {...layout} />;
	});
}

export default ComponentRenderer;
