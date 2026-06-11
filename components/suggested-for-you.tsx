"use client";

import PosterCard from "@/components/cards/poster-card";
import { CardGallerySkeleton } from "@/components/skeletons";
import { Separator } from "@/components/ui/separator";
import { getSuggestions } from "@/lib/suggestions";
import { getUserWatchlist } from "@/lib/watchlist";
import { UserAuth } from "@/providers/auth-provider";
import noItem from "@/public/no-item.png";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { useEffect, useState } from "react";

function posterImage(posterPath?: string, backdropPath?: string) {
	if (posterPath) return `https://image.tmdb.org/t/p/w342${posterPath}`;
	if (backdropPath) return `https://image.tmdb.org/t/p/w300${backdropPath}`;
	return noItem;
}

export default function SuggestedForYou() {
	const { user } = UserAuth();
	const [items, setItems] = useState<any[] | null>(null);

	useEffect(() => {
		if (!user) {
			setItems([]);
			return;
		}
		let active = true;
		(async () => {
			const watchlist = await getUserWatchlist(user.uid);
			const suggestions = await getSuggestions(watchlist, { limit: 20 });
			if (active) setItems(suggestions);
		})();
		return () => {
			active = false;
		};
	}, [user]);

	// Hide entirely for logged-out users or when there's nothing to suggest.
	if (!user) return null;
	if (items !== null && items.length === 0) return null;
	if (items === null) {
		return <CardGallerySkeleton title="Suggested for you" type="poster" />;
	}

	return (
		<div className="relative horizontal-padding group">
			<Link
				href="/suggestions"
				className="font-semibold text-lg mb-3 text-neutral-200 capitalize inline-flex items-center hover:text-white"
			>
				<span>Suggested for you</span>
				<IoChevronForward className="w-4 h-4 inline text-muted-foreground" />
			</Link>
			<div>
				<div className="flex gap-5 overflow-x-auto whitespace-nowrap no-scrollbar">
					{items.map((item) => (
						<div key={item.id}>
							<PosterCard
								image={posterImage(item.poster_path, item.backdrop_path)}
								id={item.id}
								title={item.title || item.name}
								type={item.first_air_date || item.name ? "tv" : "movie"}
							/>
						</div>
					))}
				</div>
				<div className="mt-5">
					<Separator />
				</div>
			</div>
		</div>
	);
}
