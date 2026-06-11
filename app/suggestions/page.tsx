"use client";

import PosterCard from "@/components/cards/poster-card";
import { PosterCardSkeleton } from "@/components/skeletons";
import { getSuggestions } from "@/lib/suggestions";
import { getUserWatchlist } from "@/lib/watchlist";
import { UserAuth } from "@/providers/auth-provider";
import noItem from "@/public/no-item.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function posterImage(posterPath?: string, backdropPath?: string) {
	if (posterPath) return `https://image.tmdb.org/t/p/w342${posterPath}`;
	if (backdropPath) return `https://image.tmdb.org/t/p/w300${backdropPath}`;
	return noItem;
}

export default function SuggestionsPage() {
	const { user, isLoading: authLoading } = UserAuth();
	const router = useRouter();
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	// Auth guard — wait until Firebase resolves before redirecting.
	useEffect(() => {
		if (!authLoading && !user) {
			router.replace("/");
		}
	}, [authLoading, user, router]);

	useEffect(() => {
		if (!user) return;
		setLoading(true);
		let active = true;
		(async () => {
			const watchlist = await getUserWatchlist(user.uid);
			const suggestions = await getSuggestions(watchlist, {
				sampleSize: 15,
				limit: 60,
			});
			if (active) {
				setItems(suggestions);
				setLoading(false);
			}
		})();
		return () => {
			active = false;
		};
	}, [user]);

	if (authLoading || loading) {
		return (
			<div className="horizontal-padding py-5 md:py-8">
				<div className="h-8 w-40 bg-secondary rounded mb-4 animate-pulse" />
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
					{Array.from({ length: 12 }).map((_, i) => (
						<PosterCardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="horizontal-padding py-5 md:py-8">
			<div className="flex items-baseline gap-3 mb-4">
				<h1 className="font-semibold text-xl lg:text-2xl text-neutral-200">
					Suggested for you
				</h1>
				<span className="text-muted-foreground text-sm">
					{items.length} {items.length === 1 ? "title" : "titles"}
				</span>
			</div>

			{items.length === 0 ? (
				<p className="text-muted-foreground py-12 text-center">
					Add some movies and shows to your watchlist to get personalized
					suggestions.
				</p>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
					{items.map((item) => (
						<PosterCard
							key={item.id}
							className="w-full"
							id={item.id}
							title={item.title || item.name}
							type={item.first_air_date || item.name ? "tv" : "movie"}
							image={posterImage(item.poster_path, item.backdrop_path)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
