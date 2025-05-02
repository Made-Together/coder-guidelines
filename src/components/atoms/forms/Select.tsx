import { ChangeEvent } from "react";

export interface SelectOption {
	value: string;
	name: string;
}

interface SelectProps {
	items: SelectOption[];
	activeValue: string;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	placeholder?: string;
}

function Select({ items, activeValue, onChange, placeholder }: SelectProps) {
	return (
		<select
			value={activeValue}
			onChange={onChange}
			className="mb-10 w-full border-x-0 border-b border-t-0 border-black bg-transparent bg-white pl-0 pr-3 text-[0.875rem] font-medium focus:border-black focus:ring-0 active:border-black sm:border-0"
		>
			{placeholder && (
				<option value="" disabled>
					{placeholder}
				</option>
			)}
			{items.map((item) => (
				<option key={`${item.value}-select`} value={item?.value}>
					{item?.name}
				</option>
			))}
		</select>
	);
}

export default Select;
