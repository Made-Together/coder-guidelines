import TextCard, { TextCardProps } from "~/components/molecules/TextCard";
import React from "react";

type TestComponentProps = {
	text_card: TextCardProps;
};

function TestComponent(props: TestComponentProps) {
	const { text_card } = props;
	return (
		<div>
			<TextCard {...text_card} />
		</div>
	);
}

export default TestComponent;
