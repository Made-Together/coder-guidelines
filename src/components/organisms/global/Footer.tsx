import Logo from "~/components/atoms/global/Logo";
import Link from "next/link";
import type { WpOptions } from "~/types/wp";

export default function Footer({ options: { footer_nav } }: { options: WpOptions }) {
	return (
		<footer className="border-t border-t-gray-300 py-14">
			<div className="container">
				<div className="grid gap-8 sm:grid-cols-4">
					{/* Logo */}
					<div>
						<div className="w-24 cursor-pointer lg:w-28">
							<Link href="/" aria-label="Back to Home">
								<Logo />
							</Link>
						</div>
					</div>

					{/* Footer nav */}
					<div>
						<nav className="space-y-2">
							{/* Add header nav items here */}
							{footer_nav?.items?.map((item, index) => (
								<div key={index}>
									<Link href={item?.link?.url} target={item?.link?.target}>
										<span dangerouslySetInnerHTML={{ __html: item?.link?.title }} />
									</Link>
								</div>
							))}
						</nav>
					</div>
				</div>
			</div>
		</footer>
	);
}
