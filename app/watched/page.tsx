"use client";

import Pagination from "@/components/pagination";
import PosterCard from "@/components/cards/poster-card";
import { PosterCardSkeleton } from "@/components/skeletons";
import { useBrowserEffect } from "@/hooks/use-effect";
import { watchedPage } from "@/lib/effect/watchlist-items";
import { UserAuth } from "@/providers/auth-provider";
import noItem from "@/public/no-item.png";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 20;

function buildPosterImage(posterPath?: string | null, backdropPath?: string | null) {
	if (posterPath) return `https://image.tmdb.org/t/p/w342${posterPath}`;
	if (backdropPath) return `https://image.tmdb.org/t/p/w300${backdropPath}`;
	return noItem;
}

function WatchedContent() {
	const { user, isLoading: authLoading } = UserAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const page = Number(searchParams.get("page")) || 1;

	// Items un-watched from this page; hidden locally without a refetch.
	const [removed, setRemoved] = useState<ReadonlySet<number>>(new Set());

	// Auth guard — wait until Firebase resolves before redirecting
	useEffect(() => {
		if (!authLoading && !user) {
			router.replace("/");
		}
	}, [authLoading, user, router]);

	const effect = useMemo(
		() => (user ? watchedPage(user.uid, page, PAGE_SIZE) : null),
		[user, page],
	);
	const { data, loading: dataLoading } = useBrowserEffect(effect);

	const items = (data?.items ?? []).filter((item) => !removed.has(item.id));
	const total = Math.max(0, (data?.total ?? 0) - removed.size);
	const totalPages = Math.ceil(total / PAGE_SIZE);

	if (authLoading || dataLoading) {
		return (
			<div className="horizontal-padding py-5 md:py-8">
				<div className="flex items-baseline gap-3 mb-4">
					<div className="h-8 w-32 bg-secondary rounded animate-pulse" />
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
					Watched
				</h1>
				<span className="text-muted-foreground text-sm">
					{total} {total === 1 ? "item" : "items"}
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
								title={item.title || item.name || ""}
								type={item.media_type}
								image={buildPosterImage(item.poster_path, item.backdrop_path)}
								onToggle={(id, watched) => {
									if (!watched) setRemoved((prev) => new Set(prev).add(id));
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
