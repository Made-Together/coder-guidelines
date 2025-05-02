import React, { memo, useEffect } from "react";
import Link from "next/link";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import type { WpHeaderNav } from "~/types/wp";

export default function MobileNav({
	header_nav,
	showMobileNav,
	setShowMobileNav,
}: {
	header_nav: WpHeaderNav;
	showMobileNav: boolean;
	setShowMobileNav: (show: boolean) => void; // eslint-disable-line
}) {
	const transitionSettings = {
		duration: 0.2,
		ease: "easeInOut",
	};

	const slide = {
		initial: {
			translateY: "-100%",
			transition: transitionSettings,
		},
		animate: {
			translateY: 0,
			transition: transitionSettings,
		},
		exit: {
			translateY: "-100%",
			transition: transitionSettings,
		},
	};

	useEffect(() => {
		document.body.style.overflow = showMobileNav ? "hidden" : "auto";
	}, [showMobileNav]);

	return (
		<LazyMotion features={domAnimation} strict>
			<AnimatePresence>
				{showMobileNav ? (
					<m.div key="mobile-nav" variants={slide} initial="initial" animate="animate" exit="exit" className="fixed inset-0 z-40 h-full bg-white lg:hidden">
						<div className="container flex flex-col justify-between pt-[100px]">
							<div>
								<ul className="list-none">
									{header_nav?.items?.length > 0
										? header_nav?.items?.map((item, index) => (
												<m.div
													key={`top-level-${index}`}
													initial={{ opacity: 0, x: 20 }}
													animate={{
														x: 0,
														opacity: 1,
													}}
													transition={{
														duration: 0.3,
														ease: "easeInOut",
														delay: index * 0.1,
													}}
												>
													<MemoizedMobileNavItem setShowMobileNav={setShowMobileNav} item={item} />
												</m.div>
											))
										: null}
								</ul>
							</div>
						</div>
					</m.div>
				) : null}
			</AnimatePresence>
		</LazyMotion>
	);
}

function MobileNavItem({ item, setShowMobileNav, ...other }) {
	const handleClick = () => {
		setShowMobileNav(false);
	};
	return (
		<li {...other}>
			<Link href={item?.link?.url} target={item?.link?.target} onClick={handleClick} className="flex items-center justify-between py-4 text-[32px]">
				<span dangerouslySetInnerHTML={{ __html: item?.link?.title }} />
			</Link>
		</li>
	);
}

const MemoizedMobileNavItem = memo(MobileNavItem);
