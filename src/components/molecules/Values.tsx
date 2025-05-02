type Value = {
	heading: string;
	content: string;
};

type ValuesProps = {
	values: Value[];
};

export default function Values({ values }: ValuesProps) {
	return (
		<div className="grid gap-6 md:gap-4">
			{values.map((value) => (
				<div key={value.heading} className="rounded-default bg-core grid items-start gap-4 p-8 text-white md:grid-cols-2 md:px-20 md:py-20 dark:bg-white/10">
					<h3 className="font-headings text-2xl font-medium md:text-5xl">{value.heading}</h3>
					<p className="prose leading-[1.4] opacity-80" dangerouslySetInnerHTML={{ __html: value.content }} />
				</div>
			))}
		</div>
	);
}
