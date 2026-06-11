import type React from "react";

export default async function handleShare(
	event: React.MouseEvent<HTMLElement>,
	link: string,
	title?: string,
): Promise<{ shared: boolean; copied: boolean }> {
	event.preventDefault();

	const origin =
		typeof window !== "undefined"
			? window.location.origin
			: "https://tv-app-beta.vercel.app";
	const shareUrl = `${origin}/${link}`;

	// Check if native sharing is supported in the current environment
	if (typeof navigator !== "undefined" && navigator.share) {
		try {
			await navigator.share({
				title: title || "TV App",
				url: shareUrl,
			});
			return { shared: true, copied: false };
		} catch (error) {
			// If the user cancelled the share dialog, do not fallback to copy
			if (error instanceof Error && error.name === "AbortError") {
				return { shared: false, copied: false };
			}
			// For any other sharing errors, fall back to copying the link
		}
	}

	// Fallback: Copy link to clipboard
	try {
		await navigator.clipboard.writeText(shareUrl);
		return { shared: false, copied: true };
	} catch (error) {
		return { shared: false, copied: false };
	}
}
