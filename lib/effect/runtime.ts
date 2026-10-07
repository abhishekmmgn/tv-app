import { Effect, ManagedRuntime } from "effect"
import { notFound } from "next/navigation"
import type { TmdbError } from "./errors"
import { TmdbClient } from "./tmdb"

// One runtime per server process; Effect services are built once and reused.
export const serverRuntime = ManagedRuntime.make(TmdbClient.layerLive)

// Runs a TMDB effect from a Server Component. A 404 becomes Next's notFound();
// every other TMDB failure is left to the nearest error boundary.
export const runServer = <A>(
	effect: Effect.Effect<A, TmdbError, TmdbClient>,
): Promise<A> =>
	serverRuntime.runPromise(
		effect.pipe(
			Effect.catchTag("TmdbNotFound", () => Effect.sync(() => notFound())),
		),
	)

// For optional page sections (galleries, recommendations): any TMDB failure is
// logged and becomes `null` so the rest of the page still renders.
export const runServerOrNull = <A>(
	effect: Effect.Effect<A, TmdbError, TmdbClient>,
): Promise<A | null> =>
	serverRuntime.runPromise(
		effect.pipe(
			Effect.catch((error) =>
				Effect.logError("TMDB request failed", error._tag, error.endpoint).pipe(
					Effect.as(null),
				),
			),
		),
	)
