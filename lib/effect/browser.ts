import { Layer, ManagedRuntime } from "effect"
import { AuthServiceLive, UserStoreLive } from "./firebase-live"
import { TmdbClient } from "./tmdb"

// Browser-side runtime: TMDB requests go through our `/api/tmdb/*` proxy, and
// auth / watchlist talk to Firebase.
export const browserRuntime = ManagedRuntime.make(
	Layer.mergeAll(TmdbClient.layerBrowser, AuthServiceLive, UserStoreLive),
)
