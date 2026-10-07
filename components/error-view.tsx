"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

// Shared body for error.tsx boundaries. Typed Effect errors (TmdbHttpError,
// TmdbNetworkError, ...) land here when a Server Component can't recover.
export default function ErrorView({
	error,
	reset,
	message,
}: {
	error: Error & { digest?: string };
	reset: () => void;
	message: string;
}) {
	const router = useRouter();

	useEffect(() => {
		console.error(error);
	}, [error]);

	// reset() alone re-renders the cached error payload for Server Component
	// errors; refresh the route so the server component actually re-runs.
	const retry = () =>
		startTransition(() => {
			router.refresh();
			reset();
		});

	return (
		<main className="grid h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center">
				<h1 className="my-4 text-2xl font-bold tracking-tight text-secondary-foreground md:text-3xl">
					{message}
				</h1>
				<div className="flex items-center justify-center gap-4">
					<Button variant="outline" onClick={retry}>
						Try again
					</Button>
					<Link href="/" className="text-accent">
						Go back home
					</Link>
				</div>
			</div>
		</main>
	);
}
