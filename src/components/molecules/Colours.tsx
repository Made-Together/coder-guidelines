import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";

const hexToRgb = (hex: string) => {
	// Remove the # if present
	const cleanHex = hex.replace("#", "");

	// Convert to RGB
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	return `${r}, ${g}, ${b}`;
};

const hexToHsl = (hex: string) => {
	// First convert hex to RGB
	const cleanHex = hex.replace("#", "");
	const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
	const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
	const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	// Convert to degrees and percentages
	const hDeg = Math.round(h * 360);
	const sPct = Math.round(s * 100);
	const lPct = Math.round(l * 100);

	return `${hDeg}°, ${sPct}%, ${lPct}%`;
};

const rgbToCmyk = (hex: string) => {
	// First convert hex to RGB
	const cleanHex = hex.replace("#", "");
	let r = parseInt(cleanHex.substring(0, 2), 16) / 255;
	let g = parseInt(cleanHex.substring(2, 4), 16) / 255;
	let b = parseInt(cleanHex.substring(4, 6), 16) / 255;

	// Get the maximum value of R, G, B
	const k = 1 - Math.max(r, g, b);

	// Calculate CMY values
	const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
	const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
	const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

	// Convert to percentages and round to nearest integer
	const cmyk = {
		c: Math.round(c * 100),
		m: Math.round(m * 100),
		y: Math.round(y * 100),
		k: Math.round(k * 100),
	};

	return `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`;
};

const shouldUseWhiteText = (hex: string) => {
	const cleanHex = hex.replace("#", "");
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	// Calculate relative luminance using WCAG formula
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	// Use white text if background is dark (luminance < 0.5)
	return luminance < 0.5;
};

export type ColoursBlock = {
	title: string;
	colour: string;
	CMYK?: string; // Make CMYK optional since we'll calculate it
};

type ColoursProps = {
	colours: ColoursBlock[];
};

type CopyableValueProps = {
	label: string;
	value: string;
	textColorClass: string;
};

function CopyableValue({ label, value, textColorClass }: CopyableValueProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className={`${textColorClass} group inline-flex items-center gap-2`}>
			<span className="text-[12px] font-medium uppercase">
				<span className="opacity-50">{label}:</span> {value}
			</span>
			<button type="button" onClick={handleCopy} className="opacity-0 transition-opacity hover:!opacity-100 group-hover:opacity-60" title={`Copy ${label}`}>
				{copied ? <Check size={14} /> : <Copy size={14} />}
			</button>
		</div>
	);
}

// Helper function to format color name
const formatColorName = (name: string) => {
	return (
		name
			// Split by underscores or any camelCase
			.replace(/([A-Z])/g, " $1")
			.replace(/_/g, " ")
			// Capitalize first letter of each word
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ")
			.trim()
	);
};

export default function Colours({ colours }: ColoursProps) {
	return (
		<div className="grid w-full grid-cols-1 max-md:gap-6 md:grid-cols-3 md:gap-4">
			{colours.map((colour, index) => {
				const textColorClass = shouldUseWhiteText(colour.colour) ? "text-white" : "text-black";
				const rgb = hexToRgb(colour.colour);
				const cmyk = rgbToCmyk(colour.colour);
				const hsl = hexToHsl(colour.colour);

				return (
					<div key={index} className="flex-1">
						<div className="relative w-full rounded-default border border-black/5 p-6 dark:border-white/10" style={{ backgroundColor: colour.colour }}>
							<p className={`${textColorClass} mb-8 font-headings text-[24px]`}>{formatColorName(colour.title)}</p>
							<div className="grid space-y-1">
								<CopyableValue label="Hex" value={colour.colour} textColorClass={textColorClass} />
								<CopyableValue label="RGB" value={rgb} textColorClass={textColorClass} />
								<CopyableValue label="HSL" value={hsl} textColorClass={textColorClass} />
								<CopyableValue label="CMYK" value={cmyk} textColorClass={textColorClass} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
