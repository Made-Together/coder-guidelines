type Block = {
	title: string;
};

type TextBoxProps = {
	blocks: Block[];
};

export default function TextBox({ blocks }: TextBoxProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{blocks.map((block, index) => (
				<div
					key={index}
					className="rounded-default bg-tertiary flex aspect-[485/400] items-center justify-start p-8 text-left text-center md:px-12 dark:bg-white/10"
				>
					<p className="font-headings text-[24px] font-medium leading-[1.2] md:text-[40px] dark:text-white">{block.title}</p>
				</div>
			))}
		</div>
	);
}
