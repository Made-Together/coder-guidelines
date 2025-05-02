import Template from "~/pages/[...slug]";
import cms from "~/cms";
import React from "react";

export default function Preview(data) {
	return <Template {...data} />;
}

export async function getServerSideProps(ctx) {
	const {
		query: { post_id },
	} = ctx;

	const [page, options] = await Promise.all([cms.preview(post_id), cms.options()]);

	return {
		props: { page, options },
	};
}
