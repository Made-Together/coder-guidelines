import clsx from "clsx";

interface LabelProps {
	id?: string;
	label?: string;
	className?: string;
}

function Label({ id = "", label = "", className = "" }: LabelProps) {
	return (
		<label htmlFor={id} className={clsx("block text-sm font-medium text-gray-900", className)}>
			{label}
		</label>
	);
}

export default Label;
