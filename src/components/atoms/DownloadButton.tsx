type DownloadButtonProps = {
	downloadFile: string;
	downloadText?: string;
	className?: string;
};

export default function DownloadButton({ downloadFile, downloadText, className }: DownloadButtonProps) {
	// Extract the original filename from the path
	const fileName = downloadFile ? downloadFile.split("/").pop() : "";

	return (
		<a
			href={downloadFile}
			className={`text-md group flex items-start gap-4 font-medium ${className}`}
			download={fileName}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className="mt-1">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
			</div>
			<div className="relative pb-0.5">
				{downloadText || "Download"}
				<div className="absolute bottom-0 left-0 h-[1px] w-full bg-current opacity-30 transition group-hover:h-[2px] group-hover:opacity-100" />
			</div>
		</a>
	);
}
