import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ItemNotFound() {
	return (
		<>
			<main className="grid h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="text-base font-semibold">404</p>
					<h1 className="my-4 text-2xl font-bold tracking-tight text-secondary-foreground md:text-3xl">
						The movie/series could not be found.
					</h1>
					<Link
						href="/"
						className="flex items-center justify-center text-accent"
					>
						<ChevronLeft className="inline-block" />
						<span>Go back home</span>
					</Link>
				</div>
			</main>
		</>
	);
}
