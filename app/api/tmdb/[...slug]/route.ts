import { Effect, Schema } from "effect"
import type { TmdbError } from "@/lib/effect/errors"
import { serverRuntime } from "@/lib/effect/runtime"
import { secondsUntilEndOfDay, TmdbClient } from "@/lib/effect/tmdb"

const statusOf = (error: TmdbError): number => {
	switch (error._tag) {
		case "TmdbNotFound":
			return 404
		case "TmdbUnauthorized":
			return 401
		case "TmdbHttpError":
			return error.status
		default:
			return 500
	}
}

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string[] }> },
) {
	const { slug } = await params
	const path = slug.join("/")

	// Forward query string parameters from the incoming request
	const query = new URL(request.url).searchParams.toString()
	const endpoint = query ? `${path}?${query}` : path
	const ttl = secondsUntilEndOfDay()

	const program = Effect.gen(function* () {
		const tmdb = yield* TmdbClient
		return yield* tmdb.get(endpoint, Schema.Unknown, { revalidate: ttl })
	}).pipe(
		Effect.match({
			onSuccess: (data) =>
				Response.json(data, {
					headers: {
						"Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=86400`,
					},
				}),
			onFailure: (error) => {
				console.error("TMDB proxy error:", error._tag, error.endpoint)
				return Response.json(
					{ error: `TMDB API error: ${error._tag}` },
					{ status: statusOf(error) },
				)
			},
		}),
	)

	try {
		return await serverRuntime.runPromise(program)
	} catch (error) {
		// Layer construction fails (e.g. TMDB token missing) before a request is made
		console.error("TMDB proxy failure:", error)
		return Response.json({ error: "TMDB is not configured" }, { status: 500 })
	}
}
