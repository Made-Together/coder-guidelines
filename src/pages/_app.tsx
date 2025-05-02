import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import Header from "~/components/organisms/global/Header";
import "~/assets/styles/globals.scss";
import getDeploymentDate from "~/utils/getDeploymentDate";
import { GoogleTagManager } from "@next/third-parties/google";
import FontLoader from "~/components/FontLoader";
import Seo from "~/components/organisms/global/Seo";

export const revalidate = 3600; // Revalidate every hour

export default function MyApp({ Component, pageProps }: AppProps) {
	const deploymentDate = getDeploymentDate();
	const router = useRouter();
	const isKeystaticRoute = router.asPath.startsWith("/keystatic");
	const isGuidelinesRoute = router.pathname === "/";

	if (isKeystaticRoute) {
		return <Component {...pageProps} />;
	}

	return (
		<ThemeProvider attribute="class">
			<FontLoader />
			{isGuidelinesRoute ? (
				<div className="">
					<Component {...pageProps} />
				</div>
			) : (
				<>
					{pageProps.page && <Seo page={pageProps.page} seo={pageProps.seo} />}
					<div className="">
						<Header deploymentDate={deploymentDate} global={pageProps.options?.global} />
						<main className="relative z-0 w-full bg-white dark:bg-[#000]">
							<Component {...pageProps} />
						</main>
					</div>
				</>
			)}
		</ThemeProvider>
	);
}

MyApp.getInitialProps = async ({ Component, ctx }: any) => {
	let pageProps = {};

	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps(ctx);
	}

	const deploymentDate = await getDeploymentDate();

	return { pageProps: { ...pageProps, deploymentDate } };
};
