import { useResourceContext } from "~/contexts/ResourceContext";
import clsx from "clsx";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";

function Numbered() {
	const router = useRouter();
	const { listingContext, resourcePath } = useResourceContext();
	const { page } = listingContext || {};

	const currentPage = page?.current ?? 1;
	const totalPages = page?.total;

	return (
		<div>
			<ReactPaginate
				className="flex select-none items-center justify-start gap-x-2"
				pageClassName="size-6 rounded flex text-black text-[0.875rem] items-center justify-center transition-colors duration-300 ring-1 ring-black hover:bg-black hover:text-white"
				activeClassName="!text-white !bg-black"
				breakLabel="..."
				breakClassName="w-7 flex justify-center"
				initialPage={currentPage - 1}
				onClick={({ event }: { event }) => {
					router.push(event.currentTarget.href, undefined, { scroll: false });
				}}
				hrefBuilder={(pageNum, pageCount) => (pageNum > 1 && pageNum <= pageCount ? `${resourcePath}page/${pageNum}` : `${resourcePath}`)}
				pageRangeDisplayed={4}
				marginPagesDisplayed={2}
				pageCount={totalPages}
				renderOnZeroPageCount={null}
				previousLinkClassName={currentPage === 1 && "pointer-events-none"}
				nextLinkClassName={currentPage === totalPages && "pointer-events-none"}
				previousLabel={<NavigationLabel isDisabled={currentPage === 1} direction="previous" />}
				nextLabel={<NavigationLabel isDisabled={currentPage === totalPages} direction="next" />}
			/>
		</div>
	);
}

// Navigation label component to reduce duplication
function NavigationLabel({ isDisabled, direction }) {
	return (
		<div
			className={clsx(
				direction === "previous" ? "mr-2" : "ml-2",
				isDisabled ? "cursor-default text-black/60" : "transition-colors duration-300 hover:border-black hover:text-black/80"
			)}
		>
			{direction}
		</div>
	);
}

export default Numbered;
