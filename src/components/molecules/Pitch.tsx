import Image from "next/image";
import Link from "next/link";

type PitchProps = {
	content: string;
};

export default function Pitch({ content }: PitchProps) {
	return (
		<div className="text-[24px] md:max-w-[85%] md:pb-20 md:text-[48px] dark:text-white">
			<p className="font-headings leading-[1.3]" dangerouslySetInnerHTML={{ __html: content }} />
		</div>
	);
}
