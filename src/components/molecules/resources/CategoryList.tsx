import { useResourceContext } from "~/contexts/ResourceContext";
import Select from "~/components/atoms/forms/Select";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

function CategoryList() {
	const router = useRouter();
	const { listingContext } = useResourceContext();

	const { taxonomyTerms, taxonomies } = listingContext ?? {};

	const categories = taxonomyTerms?.category ?? [];
	const activeSlug = taxonomies?.category ?? "all";

	const isActive = (slug) => slug === activeSlug;

	const handleCategoryChange = (event) => {
		router.push(event.target.value);
	};

	return (
		<div>
			<div className="md:hidden">
				<Select items={categories.map((category) => ({ value: category.url, name: category.name }))} activeValue={activeSlug} onChange={handleCategoryChange} />
			</div>
			<div className="hidden md:flex md:gap-x-1.5">
				{categories.map((category) => (
					<Link
						key={category.slug}
						href={category.url}
						className={clsx("relative isolate overflow-hidden rounded-xl px-6 py-3 text-[1rem]", isActive(category.slug) ? "text-white" : "text-black")}
					>
						{isActive(category.slug) && <div className="absolute inset-0 -z-10 bg-black" />}
						{category.name}
					</Link>
				))}
			</div>
		</div>
	);
}

export default CategoryList;
