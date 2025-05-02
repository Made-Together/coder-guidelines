export type TextBoxBlock = {
	title: string;
	content?: string;
};

type TextBoxContentProps = {
	blocks: TextBoxBlock[];
};

export default function TextBoxContent({ blocks }: TextBoxContentProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{blocks.map((block, index) => (
				<div
					key={index}
					className="2 rounded-default bg-core flex aspect-[485/300] flex-col items-start justify-between p-6 text-left text-white md:p-10 dark:bg-white/10"
				>
					<p className="font-headings text-[24px] font-medium leading-[1.2] md:text-[40px]">{block.title}</p>
					<p className="font-body">{block.content}</p>
				</div>
			))}
		</div>
	);
}
