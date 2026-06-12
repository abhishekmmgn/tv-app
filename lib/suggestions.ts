import { fetchTMDBData } from "@/lib/requests";
import type { ItemType } from "@/types";

type WatchItem = { id: number; type: ItemType };

type Options = {
	/** How many recent watched items to use as seeds for recommendations. */
	sampleSize?: number;
	/** Max number of suggestions to return. */
	limit?: number;
};

/**
 * Builds a "Suggested for you" list from the user's watched items using
 * TMDB's own recommendation engine.
 *
 * Strategy: take the most recently added watched items as seeds, fetch
 * `/{type}/{id}/recommendations` for each, then merge. Titles recommended by
 * multiple seeds score higher; anything already watched is filtered out.
 */
export async function getSuggestions(
	watchlist: WatchItem[],
	{ sampleSize = 8, limit = 40 }: Options = {},
): Promise<any[]> {
	if (!watchlist.length) return [];

	// watchlist is appended via arrayUnion, so the tail is the most recent.
	const seeds = watchlist.slice(-sampleSize).reverse();
	const watchedIds = new Set(watchlist.map((item) => item.id));

	const responses = await Promise.all(
		seeds.map((seed) =>
			fetchTMDBData(`${seed.type}/${seed.id}/recommendations`),
		),
	);

	// Score each candidate by how often it's recommended across the seeds.
	const scored = new Map<number, { item: any; score: number }>();
	for (const res of responses) {
		const results: any[] = res?.results ?? [];
		for (const item of results) {
			if (!item?.id || watchedIds.has(item.id)) continue;
			if (item.adult) continue;
			if (!item.poster_path && !item.backdrop_path) continue;

			const existing = scored.get(item.id);
			if (existing) {
				existing.score += 1;
			} else {
				scored.set(item.id, { item, score: 1 });
			}
		}
	}

	return Array.from(scored.values())
		.sort(
			(a, b) =>
				b.score - a.score ||
				(b.item.popularity ?? 0) - (a.item.popularity ?? 0),
		)
		.slice(0, limit)
		.map((entry) => entry.item);
}
