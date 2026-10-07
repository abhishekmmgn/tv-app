import { Config } from "effect"

// Server-side TMDB settings. `TMDB_AUTH_TOKEN` is preferred; the public
// variable is kept as a fallback so existing deployments keep working.
export const TmdbConfig = Config.all({
	baseUrl: Config.String("TMDB_BASE_URL").pipe(
		Config.withDefault("https://api.themoviedb.org/3"),
	),
	token: Config.Redacted("TMDB_AUTH_TOKEN").pipe(
		Config.orElse(() => Config.Redacted("NEXT_PUBLIC_TMDB_AUTH_TOKEN")),
	),
})
