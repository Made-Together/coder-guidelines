import Image from "next/image";
import Link from "next/link";

type EyebrowProps = {
	content: string;
};

export default function Eyebrow({ content }: EyebrowProps) {
	return (
		<div className="text-[12px] dark:text-white md:max-w-[85%]">
			<p className="font-accent font-medium uppercase leading-[1.3]" dangerouslySetInnerHTML={{ __html: content }} />
		</div>
	);
}
