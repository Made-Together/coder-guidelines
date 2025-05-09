import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Squash as Hamburger } from "hamburger-react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants, useScroll, useSpring, useTransform, animate } from "framer-motion";
import { Download } from "lucide-react";
import type { SectionContent } from "~/components/molecules/Section";

// Consistent slugify function
const slugify = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.035,
			delayChildren: 0.15,
			ease: [0.2, 0.65, 0.3, 0.9],
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 10 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 30,
			mass: 0.5,
		},
	},
};

const subMenuVariants: Variants = {
	hidden: {
		opacity: 0,
		height: 0,
		transition: {
			duration: 0.2,
			ease: [0.2, 0.65, 0.3, 0.9],
		},
	},
	show: {
		opacity: 1,
		height: "auto",
		transition: {
			duration: 0.3,
			ease: [0.2, 0.65, 0.3, 0.9],
		},
	},
};

const subItemVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 5,
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.2,
			ease: [0.2, 0.65, 0.3, 0.9],
		},
	},
};

type ChapterSection = {
	content: SectionContent[];
	spacing?: "default" | "small";
};

type ChapterType = {
	heading: string;
	sections: ChapterSection[];
	slug: string;
};

type GlobalConfig = {
	masthead: {
		image: string;
		alt: string;
		heading?: string;
	};
	footer: {
		image: string;
		alt: string;
		heading?: string;
	};
	logo: string;
	assetsZip?: string;
	seo: {
		title: string;
		description: string;
		url: string;
		image: string;
	};
};

type HeaderProps = {
	deploymentDate: string;
	logo?: string;
	chapters?: ChapterType[];
	global?: GlobalConfig;
};

type Theme = "light" | "dark";

// Create a map of section IDs to their parent chapters for faster lookup
const sectionToChapterMap = new Map();

export default function Header({ deploymentDate, logo = "/images/logo.svg", chapters = [], global }: HeaderProps) {
	const [openSection, setOpenSection] = useState<string | null>(null);
	const [activeSection, setActiveSection] = useState<string | null>(null);
	const [theme, setTheme] = useState<Theme>("light");
	const [userHasInteracted, setUserHasInteracted] = useState(false);
	const { scrollYProgress, scrollY } = useScroll();
	const mobileMenuRef = useRef<HTMLUListElement>(null);

	// Reset user interaction flag on scroll
	useEffect(() => {
		let timeout: number;
		const handleScroll = () => {
			window.clearTimeout(timeout);
			timeout = window.setTimeout(() => {
				setUserHasInteracted(false);
			}, 150); // Small delay to prevent immediate reactivation
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.clearTimeout(timeout);
		};
	}, []);

	// Transform chapters data into menu items format
	const menuItems = chapters.map((chapter, index) => ({
		id: index < 9 ? `0${index + 1}` : `${index + 1}`,
		title: chapter.heading,
		items: chapter.sections.flatMap((section) =>
			section.content
				.filter((item): item is Extract<SectionContent, { discriminant: "intro" }> => item.discriminant === "intro")
				.map((item) => ({
					title: item.value.heading,
					uniqueId: `${index + 1}-${slugify(item.value.heading)}`,
				}))
		),
	}));

	useEffect(() => {
		// Check if theme was previously set
		const savedTheme = localStorage.getItem("theme") as Theme;
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

		if (savedTheme) {
			setTheme(savedTheme);
			document.documentElement.classList.toggle("dark", savedTheme === "dark");
		} else {
			// If no saved theme, use system preference
			setTheme(prefersDark ? "dark" : "light");
			document.documentElement.classList.toggle("dark", prefersDark);
		}

		// Listen for system theme changes
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem("theme")) {
				const newTheme = e.matches ? "dark" : "light";
				setTheme(newTheme);
				document.documentElement.classList.toggle("dark", e.matches);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const toggleTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	// Smooth out the scroll progress with spring physics
	const scaleY = useSpring(scrollYProgress, {
		stiffness: 300,
		damping: 30,
		restDelta: 0.001,
	});

	// Add function to scroll active section into view on mobile
	const scrollActiveSectionIntoView = (sectionId: string) => {
		if (window.innerWidth >= 768) return; // Only run on mobile

		const mobileMenu = mobileMenuRef.current;
		if (!mobileMenu) return;

		const activeButton = mobileMenu.querySelector(`[data-section="${sectionId}"]`) as HTMLElement;
		if (!activeButton) return;

		const targetScroll = activeButton.offsetLeft - 24;

		animate(mobileMenu.scrollLeft, targetScroll, {
			type: "spring",
			stiffness: 200,
			damping: 30,
			mass: 0.5,
			duration: 0.6,
			onUpdate: (value) => {
				mobileMenu.scrollLeft = value;
			},
		});
	};

	// Track section visibility and scroll position
	useEffect(() => {
		let currentBestIntersection = {
			ratio: 0,
			id: null as string | null,
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// Update the best intersection if this entry has a higher ratio
					if (entry.intersectionRatio > currentBestIntersection.ratio) {
						currentBestIntersection = {
							ratio: entry.intersectionRatio,
							id: entry.target.id,
						};
					} else if (!entry.isIntersecting && entry.target.id === currentBestIntersection.id) {
						// Reset if the current best is no longer intersecting
						currentBestIntersection = {
							ratio: 0,
							id: null,
						};
					}

					// Find the entry with the highest intersection ratio
					const bestEntry = entries.reduce((best, current) => {
						return current.intersectionRatio > best.intersectionRatio ? current : best;
					}, entries[0]);

					if (bestEntry && bestEntry.intersectionRatio > 0) {
						const sectionId = bestEntry.target.id;
						setActiveSection(sectionId);

						// Skip automatic opening if user has manually interacted
						if (userHasInteracted) return;

						// First check if this is a chapter ID
						const chapterIndex = chapters.findIndex((chapter) => chapter.slug === sectionId);
						if (chapterIndex !== -1) {
							const newOpenSection = `0${chapterIndex + 1}`;
							setOpenSection(newOpenSection);
							scrollActiveSectionIntoView(newOpenSection);
							return;
						}

						// Then check if it's a section ID
						const parentChapter = menuItems.find((item) => item.items.some((subItem) => subItem.uniqueId === sectionId));
						if (parentChapter) {
							setOpenSection(parentChapter.id);
							scrollActiveSectionIntoView(parentChapter.id);
						}
					}
				});
			},
			{
				rootMargin: "-45% 0px -45% 0px",
				threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
			}
		);

		// Observe both chapter and section elements
		chapters.forEach((chapter) => {
			const element = document.getElementById(chapter.slug);
			if (element) observer.observe(element);
		});

		document.querySelectorAll("[id]").forEach((section) => {
			observer.observe(section);
		});

		return () => {
			observer.disconnect();
		};
	}, [menuItems, chapters, openSection, userHasInteracted]);

	const toggleSection = (id: string) => {
		setUserHasInteracted(true);
		setOpenSection(openSection === id ? null : id);

		// Only handle scrolling on mobile
		if (window.innerWidth < 768) {
			const section = menuItems.find((item) => item.id === id);
			if (section) {
				if (section.items.length > 0) {
					const firstItemId = section.items[0].uniqueId;
					scrollToSection(`#${firstItemId}`);
				} else {
					const chapterIndex = parseInt(id.replace(/^0/, "")) - 1;
					const chapter = chapters[chapterIndex];
					if (chapter) {
						scrollToSection(`#${chapter.slug}`);
					}
				}
			}
		}
	};

	const scrollToSection = (sectionId: string) => {
		const id = sectionId.replace("#", "");
		const element = document.getElementById(id);

		if (element) {
			// Update URL without triggering scroll
			window.history.pushState(null, "", `#${id}`);

			// Calculate position
			const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
			const offsetPosition = elementPosition - 128;

			// Smooth scroll
			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});

			// Find and open the parent chapter
			const parentChapter = menuItems.find(
				(item) => item.items.some((subItem) => subItem.uniqueId === id) || chapters[parseInt(item.id.replace(/^0/, "")) - 1]?.slug === id
			);
			if (parentChapter) {
				setOpenSection(parentChapter.id);
			}
		}
	};

	return (
		<motion.div
			initial={typeof window !== "undefined" && window.innerWidth >= 768 ? { x: -100, opacity: 0 } : false}
			animate={typeof window !== "undefined" && window.innerWidth >= 768 ? { x: 0, opacity: 1 } : false}
			transition={{
				type: "spring",
				stiffness: 200,
				damping: 30,
				mass: 0.5,
			}}
			className="fixed left-0 top-0 z-50 flex w-full shrink-0 flex-col justify-between border-black/5 bg-white/95 dark:border-white/10 dark:bg-black dark:text-white max-md:border-b max-md:backdrop-blur-sm md:h-screen md:w-[300px] md:border-r md:p-6"
		>
			<motion.div
				className="absolute -right-0.5 top-0 z-10 w-0.5 origin-top bg-accent max-md:hidden"
				style={{
					scaleY,
					height: "100%",
				}}
			/>
			<div>
				<div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 max-md:h-14 max-md:px-6 md:pb-8">
					<Link href="/" className="flex items-center justify-start">
						<Image src={logo} alt="Logo" width={115} height={21} className="h-6 object-contain object-left dark:brightness-100 dark:invert md:h-8" />
					</Link>
					<div className="relative">
						<div
							className="flex h-8 items-center rounded-full border border-black/[0.1] p-1 dark:border-white/[0.1]"
							onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
							role="button"
							tabIndex={0}
						>
							<div className="absolute inset-1">
								<motion.div
									className="h-6 w-6 rounded-full bg-black/10 dark:bg-white/20"
									animate={{
										x: theme === "dark" ? 33 : 1,
									}}
									transition={{
										type: "spring",
										stiffness: 200,
										damping: 30,
										mass: 0.5,
									}}
								/>
							</div>
							<button className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full transition-colors`} aria-label="Use light theme">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-4 w-4"
								>
									<circle cx="12" cy="12" r="4"></circle>
									<path d="M12 2v2"></path>
									<path d="M12 20v2"></path>
									<path d="m4.93 4.93 1.41 1.41"></path>
									<path d="m17.66 17.66 1.41 1.41"></path>
									<path d="M2 12h2"></path>
									<path d="M20 12h2"></path>
									<path d="m6.34 17.66-1.41 1.41"></path>
									<path d="m19.07 4.93-1.41 1.41"></path>
								</svg>
							</button>
							<div className="w-2" /> {/* Reduced spacer */}
							<button className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full transition-colors`} aria-label="Use dark theme">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-4 w-4"
								>
									<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>
				<div className="mt-6 font-mono text-[12px] uppercase max-md:hidden">
					<p>Visual identity guidelines</p>
					<p className="opacity-50">{deploymentDate}</p>
				</div>
				<motion.ul
					variants={containerVariants}
					initial="hidden"
					animate="show"
					ref={mobileMenuRef}
					className="h-10 max-md:flex max-md:flex-nowrap max-md:items-center max-md:space-x-4 max-md:overflow-x-auto max-md:whitespace-nowrap md:mt-8 md:space-y-2"
				>
					{menuItems.map((item) => (
						<motion.li variants={itemVariants} key={item.id} className="max-md:first:ml-6 max-md:last:pr-6">
							<button
								type="button"
								onClick={() => toggleSection(item.id)}
								data-section={item.id}
								className={`group items-center justify-between text-left md:flex md:w-full ${
									(activeSection && item.items.some((subItem) => subItem.uniqueId === activeSection)) || item.id === openSection
										? "opacity-100"
										: "opacity-50 hover:opacity-100"
								}`}
							>
								<div className="flex items-center gap-2">
									<div
										className={`w-6 transition-opacity group-hover:opacity-100 max-md:hidden ${openSection === item.id ? "opacity-100" : "opacity-40 dark:opacity-40"}`}
									>
										{item.id}
									</div>
									<p className="max-md:text-sm">{item.title}</p>
								</div>
								<svg
									className={`h-4 w-4 transform transition-transform max-md:hidden ${openSection === item.id ? "rotate-180" : ""}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							<motion.ul
								variants={subMenuVariants}
								initial="hidden"
								animate={openSection === item.id ? "show" : "hidden"}
								className="mt-2 space-y-2 overflow-hidden pl-8 max-md:hidden"
							>
								{item.items.map((subItem) => {
									const isActive = activeSection === subItem.uniqueId;
									return (
										<li key={subItem.uniqueId} className={`transition-opacity ${isActive ? "opacity-100" : "opacity-50"} last:pb-2 hover:opacity-100`}>
											<Link
												href={`#${subItem.uniqueId}`}
												className="block w-full text-left"
												onClick={(e) => {
													e.preventDefault();
													scrollToSection(`#${subItem.uniqueId}`);
												}}
											>
												<p className={`transition-all ${isActive ? "translate-x-1 font-medium" : ""}`}>{subItem.title}</p>
											</Link>
										</li>
									);
								})}
							</motion.ul>
						</motion.li>
					))}
				</motion.ul>
			</div>
			{global?.assetsZip && (
				<motion.a
					href={global.assetsZip}
					download
					whileHover={{ scale: 0.98 }}
					whileTap={{ scale: 0.97 }}
					transition={{
						duration: 0.2,
						ease: [0.2, 0.65, 0.3, 0.9],
					}}
					className="mt-8 w-full rounded-default bg-accent p-2 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:bg-accent/95 hover:brightness-110 dark:bg-white dark:text-black dark:hover:bg-white/95 dark:hover:brightness-110 max-md:hidden"
				>
					<span className="flex items-center justify-center gap-4">
						Download all assets
						<Download size={16} />
					</span>
				</motion.a>
			)}
		</motion.div>
	);
}
