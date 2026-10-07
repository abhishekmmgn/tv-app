import { UserStore } from "@/lib/effect/firebase";
import { type TmdbItem, TmdbList, type WatchItem } from "@/lib/effect/schemas";
import { tmdbGet } from "@/lib/effect/tmdb";
import { Effect } from "effect";

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
export const suggestionsEffect = Effect.fn("getSuggestions")(function* (
	watchlist: ReadonlyArray<WatchItem>,
	{ sampleSize = 8, limit = 40 }: Options = {},
) {
	if (!watchlist.length) return [] as TmdbItem[];

	// watchlist is appended via arrayUnion, so the tail is the most recent.
	const seeds = watchlist.slice(-sampleSize).reverse();
	const watchedIds = new Set(watchlist.map((item) => item.id));

	// A failed seed just contributes no recommendations.
	const responses = yield* Effect.forEach(
		seeds,
		(seed) =>
			tmdbGet(`${seed.type}/${seed.id}/recommendations`, TmdbList).pipe(
				Effect.catch(() => Effect.succeed(null)),
			),
		{ concurrency: "unbounded" },
	);

	// Score each candidate by how often it's recommended across the seeds.
	const scored = new Map<number, { item: TmdbItem; score: number }>();
	for (const res of responses) {
		for (const item of res?.results ?? []) {
			if (watchedIds.has(item.id)) continue;
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
});

// Suggestions for a signed-in user, seeded from their Firestore watchlist.
export const suggestionsFor = Effect.fn("suggestionsFor")(function* (
	uid: string,
	options?: Options,
) {
	const store = yield* UserStore;
	return yield* suggestionsEffect(yield* store.getWatchlist(uid), options);
});
