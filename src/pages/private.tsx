import Template from "~/pages/[...slug]";
import cms from "~/cms";
import React from "react";

export default function Private(data) {
	return <Template {...data} />;
}

Private.getInitialProps = async (ctx) => {
	const { post_id, key } = ctx.query;
	return cms.get(`/wp-json/together/private?post_id=${post_id}&key=${key}`);
};
