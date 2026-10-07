"use client";

import PosterCard from "@/components/cards/poster-card";
import { PosterCardSkeleton } from "@/components/skeletons";
import { useBrowserEffect } from "@/hooks/use-effect";
import { suggestionsFor } from "@/lib/suggestions";
import { UserAuth } from "@/providers/auth-provider";
import noItem from "@/public/no-item.png";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

function posterImage(posterPath?: string | null, backdropPath?: string | null) {
	if (posterPath) return `https://image.tmdb.org/t/p/w342${posterPath}`;
	if (backdropPath) return `https://image.tmdb.org/t/p/w300${backdropPath}`;
	return noItem;
}

export default function SuggestionsPage() {
	const { user, isLoading: authLoading } = UserAuth();
	const router = useRouter();
	// Auth guard — wait until Firebase resolves before redirecting.
	useEffect(() => {
		if (!authLoading && !user) {
			router.replace("/");
		}
	}, [authLoading, user, router]);

	const effect = useMemo(
		() =>
			user ? suggestionsFor(user.uid, { sampleSize: 15, limit: 60 }) : null,
		[user],
	);
	const { data, loading } = useBrowserEffect(effect);
	const items = data ?? [];

	if (authLoading || loading) {
		return (
			<div className="horizontal-padding py-5 md:py-8">
				<div className="flex items-baseline gap-3 mb-4">
					<div className="h-8 w-40 bg-secondary rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
					{Array.from({ length: 12 }).map((_, i) => (
						<PosterCardSkeleton key={i} className="w-full" />
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
							title={item.title || item.name || ""}
							type={item.first_air_date || item.name ? "tv" : "movie"}
							image={posterImage(item.poster_path, item.backdrop_path)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
