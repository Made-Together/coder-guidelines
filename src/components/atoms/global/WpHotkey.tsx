import { useHotkeys } from "react-hotkeys-hook";

export default function WpHotkey({ id }) {
	useHotkeys(
		"w+p+m",
		() => {
			if (typeof window !== "undefined" && id) {
				window.open(`${process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL}/wp-admin/post.php?post=${id}&action=edit`);
			}
		},
		[id]
	);
	return null;
}
