import { motion } from "framer-motion";

type Block = {
	title?: string;
	id?: string;
};

type TwoBoxTextProps = {
	block_1: Block[];
	block_1_title: string;
	block_2: Block[];
	block_2_title: string;
	block_1_styles?: {
		container?: string;
		title?: string;
		text?: string;
	};
	block_2_styles?: {
		container?: string;
		title?: string;
		text?: string;
	};
};

export default function TwoBoxText({
	block_1,
	block_1_title,
	block_2,
	block_2_title,
	block_1_styles = {
		container: "rounded-default bg-tertiary dark:bg-white/10 dark:text-white flex aspect-[485/400] items-center justify-center overflow-hidden p-8 text-center",
		title: "mb-6 text-[12px] font-medium font-accent uppercase dark:text-white",
		text: "text-[18px] md:text-[22px]",
	},
	block_2_styles = {
		container: "rounded-default flex aspect-[485/400] bg-core text-white dark:bg-white/10 items-center justify-center overflow-hidden p-8 px-12 text-center",
		title: "mb-6 text-[12px] font-medium font-accent uppercase dark:text-white",
		text: "text-[24px] md:text-[40px] leading-[1.2] font-headings",
	},
}: TwoBoxTextProps) {
	return (
		<div className="grid gap-16 md:grid-cols-2 md:gap-6">
			<div>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
					className={block_1_styles.title}
				>
					{block_1_title}
				</motion.p>
				<div className="grid gap-6">
					{block_1.map((block, index) => (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.5,
								delay: index * 0.1,
								ease: [0.2, 0.65, 0.3, 0.9],
							}}
							className={block_1_styles.container}
							key={block.id}
						>
							<h2 className={block_1_styles.text}>{block.title}</h2>
						</motion.div>
					))}
				</div>
			</div>
			<div>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
					className={block_2_styles.title}
				>
					{block_2_title}
				</motion.p>
				<div className="grid gap-6">
					{block_2.map((block, index) => (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.5,
								delay: index * 0.1,
								ease: [0.2, 0.65, 0.3, 0.9],
							}}
							className={block_2_styles.container}
							key={block.id}
						>
							<h2 className={block_2_styles.text}>{block.title}</h2>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
