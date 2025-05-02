export type DoDontBlock = {
	heading: string;
	content: string;
};

type DoDontProps = {
	right: DoDontBlock[];
	wrong: DoDontBlock[];
};

export default function DoDont({ right, wrong }: DoDontProps) {
	return (
		<>
			<div className="mb-6 grid gap-6 md:grid-cols-3">
				{right.map((block, index) => (
					<div key={index} className="2 rounded-default bg-tertiary p-6 text-left dark:bg-white/10 dark:text-white md:p-8">
						<div className="text-black dark:invert">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="24" height="24" rx="12" fill="currentColor" />
								<path d="M7.3125 12.6695L9.99061 15.3476L16.6859 8.65234" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
							</svg>
						</div>
						<div className="mt-12 space-y-2 md:mt-28">
							<p className="font-headings text-[24px] font-medium leading-[1.2] md:text-[32px]">{block.heading}</p>
							<p className="font-body">{block.content}</p>
						</div>
					</div>
				))}
			</div>
			<div className="grid gap-6 md:grid-cols-3">
				{wrong.map((block, index) => (
					<div key={index} className="2 rounded-default bg-core p-6 text-left text-white dark:bg-white/10 md:p-8">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="24" height="24" rx="12" fill="currentColor" />
							<path d="M8 8L16 16M16 8L8 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<div className="mt-12 space-y-2 md:mt-28">
							<p className="font-headings text-[24px] font-medium leading-[1.2] md:text-[32px]">{block.heading}</p>
							<p className="font-body">{block.content}</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
