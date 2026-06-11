"use client";

import Pagination from "@/components/pagination";
import PosterCard from "@/components/cards/poster-card";
import { PosterCardSkeleton } from "@/components/skeletons";
import { fetchTMDBData } from "@/lib/requests";
import { getUserWatchlist } from "@/lib/watchlist";
import { UserAuth } from "@/providers/auth-provider";
import noItem from "@/public/no-item.png";
import type { ItemType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const PAGE_SIZE = 20;

function buildPosterImage(posterPath?: string, backdropPath?: string) {
	if (posterPath) return `https://image.tmdb.org/t/p/w342${posterPath}`;
	if (backdropPath) return `https://image.tmdb.org/t/p/w300${backdropPath}`;
	return noItem;
}

function WatchedContent() {
	const { user, isLoading: authLoading } = UserAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const page = Number(searchParams.get("page")) || 1;

	const [watchlist, setWatchlist] = useState<{ id: number; type: ItemType }[] | null>(
		null,
	);
	const [items, setItems] = useState<any[]>([]);
	const [dataLoading, setDataLoading] = useState(true);
	const [prevPage, setPrevPage] = useState(page);

	// Auth guard — wait until Firebase resolves before redirecting
	useEffect(() => {
		if (!authLoading && !user) {
			router.replace("/");
		}
	}, [authLoading, user, router]);

	useEffect(() => {
		if (!user) return;
		getUserWatchlist(user.uid).then((list) => {
			setWatchlist(list);
		});
	}, [user]);

	// Fetch TMDB data for the current page slice
	useEffect(() => {
		if (!user || watchlist === null) return;
		if (watchlist.length === 0) {
			setItems([]);
			setDataLoading(false);
			return;
		}

		if (page !== prevPage) {
			setDataLoading(true);
			setPrevPage(page);
		}

		const pageSlice = watchlist.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
		Promise.all(
			pageSlice.map((item) =>
				fetchTMDBData(`${item.type}/${item.id}`).then((data) =>
					data ? { ...data, media_type: item.type } : null,
				),
			),
		).then((results) => {
			setItems(results.filter(Boolean));
			setDataLoading(false);
		});
	}, [user, watchlist, page, prevPage]);

	const totalPages = watchlist ? Math.ceil(watchlist.length / PAGE_SIZE) : 0;

	if (authLoading || dataLoading) {
		return (
			<div className="horizontal-padding py-5 md:py-8">
				<div className="h-8 w-32 bg-secondary rounded mb-4 animate-pulse" />
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
					Watched
				</h1>
				<span className="text-muted-foreground text-sm">
					{watchlist?.length || 0} {(watchlist?.length || 0) === 1 ? "item" : "items"}
				</span>
			</div>

			{items.length === 0 ? (
				<p className="text-muted-foreground py-12 text-center">
					Nothing in your watchlist yet. Start adding movies and shows!
				</p>
			) : (
				<>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
						{items.map((item) => (
							<PosterCard
								key={`${item.media_type}-${item.id}`}
								className="w-full"
								id={item.id}
								title={item.title || item.name}
								type={item.media_type}
								image={buildPosterImage(item.poster_path, item.backdrop_path)}
								onToggle={(id, watched) => {
									if (!watched) {
										setWatchlist((prev) => prev ? prev.filter((w) => w.id !== id) : null);
										setItems((prev) => prev.filter((i) => i.id !== id));
									}
								}}
							/>
						))}
					</div>
					{totalPages > 1 && (
						<Suspense>
							<Pagination totalPages={totalPages} />
						</Suspense>
					)}
				</>
			)}
		</div>
	);
}

export default function WatchedPage() {
	return (
		<Suspense>
			<WatchedContent />
		</Suspense>
	);
}
