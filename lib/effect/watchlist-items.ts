import { Effect, Predicate } from "effect"
import { TmdbDetails, type WatchItem } from "./schemas"
import { UserStore } from "./firebase"
import { tmdbGet } from "./tmdb"

// Loads TMDB details for watchlist entries. An entry that fails (deleted
// title, network error) is skipped instead of failing the whole list.
export const watchlistDetails = Effect.fn("watchlistDetails")(function* (
	items: ReadonlyArray<WatchItem>,
) {
	const results = yield* Effect.forEach(
		items,
		(item) =>
			tmdbGet(`${item.type}/${item.id}`, TmdbDetails).pipe(
				Effect.map((details) => ({ ...details, media_type: item.type })),
				Effect.catch(() => Effect.succeed(null)),
			),
		{ concurrency: 5 },
	)
	return results.filter(Predicate.isNotNull)
})

// Everything on the user's watchlist, with TMDB details.
export const libraryItems = Effect.fn("libraryItems")(function* (uid: string) {
	const store = yield* UserStore
	return yield* watchlistDetails(yield* store.getWatchlist(uid))
})

// One page of the watched list, plus the total count for pagination.
export const watchedPage = Effect.fn("watchedPage")(function* (
	uid: string,
	page: number,
	pageSize: number,
) {
	const store = yield* UserStore
	const list = yield* store.getWatchlist(uid)
	const items = yield* watchlistDetails(
		list.slice((page - 1) * pageSize, page * pageSize),
	)
	return { total: list.length, items }
})
