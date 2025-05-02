import Template, { getStaticProps as getPageStaticProps } from "~/pages/[...slug]";

export default Template;

export async function getStaticProps(ctx) {
	const props = await getPageStaticProps({
		...ctx,
		params: { slug: ["404-2"] },
	});
	return props;
}
