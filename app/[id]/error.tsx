"use client";

import ErrorView from "@/components/error-view";

export default function ItemError(props: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<ErrorView {...props} message="We couldn't load this movie or series." />
	);
}
