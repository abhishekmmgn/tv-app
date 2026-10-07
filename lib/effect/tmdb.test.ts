import { assert, describe, it } from "@effect/vitest"
import { vi } from "vitest"
import { ConfigProvider, Effect, Layer } from "effect"
import { HttpClient, HttpClientError, HttpClientResponse } from "effect/http"
import { TmdbList } from "./schemas"
import { buildTmdbUrl, TmdbClient } from "./tmdb"

const mockLayer = (
	respond: (url: URL) => Response,
	seen: Array<URL> = [],
) =>
	TmdbClient.layer.pipe(
		Layer.provide(
			Layer.succeed(
				HttpClient.HttpClient,
				HttpClient.make((request, url) => {
					seen.push(url)
					return Effect.succeed(HttpClientResponse.fromWeb(request, respond(url)))
				}),
			),
		),
		Layer.provide(
			ConfigProvider.layer(ConfigProvider.fromUnknown({ TMDB_AUTH_TOKEN: "test-token" })),
		),
	)

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	})

const run = <A, E>(
	layer: ReturnType<typeof mockLayer>,
	f: (client: TmdbClient["Service"]) => Effect.Effect<A, E>,
) => Effect.gen(function* () {
	const client = yield* TmdbClient
	return yield* f(client)
}).pipe(Effect.provide(layer))

describe("buildTmdbUrl", () => {
	it("adds include_adult=false to search and discover", () => {
		assert.strictEqual(
			buildTmdbUrl("https://x/3", "/search/multi?query=a").searchParams.get("include_adult"),
			"false",
		)
		assert.strictEqual(
			buildTmdbUrl("https://x/3", "discover/movie").searchParams.get("include_adult"),
			"false",
		)
	})
	it("respects an explicit include_adult and skips other endpoints", () => {
		assert.strictEqual(
			buildTmdbUrl("https://x/3", "search/multi?include_adult=true").searchParams.get("include_adult"),
			"true",
		)
		assert.isFalse(buildTmdbUrl("https://x/3", "movie/popular").searchParams.has("include_adult"))
	})
})

describe("TmdbClient", () => {
	it.effect("decodes a successful response", () =>
		run(mockLayer(() => json({ results: [{ id: 1, title: "A" }] })), (c) =>
			c.get("movie/popular", TmdbList),
		).pipe(Effect.map((list) => assert.strictEqual(list.results[0].id, 1))))

	it.effect("sends the bearer token and normalised URL", () => {
		const seen: Array<URL> = []
		return run(mockLayer(() => json({ results: [] }), seen), (c) =>
			c.get("/discover/tv?with_networks=213", TmdbList),
		).pipe(
			Effect.map(() => {
				assert.strictEqual(seen[0].pathname, "/3/discover/tv")
				assert.strictEqual(seen[0].searchParams.get("include_adult"), "false")
			}),
		)
	})

	for (const [status, tag] of [
		[404, "TmdbNotFound"],
		[401, "TmdbUnauthorized"],
		[500, "TmdbHttpError"],
	] as const) {
		it.effect(`maps ${status} to ${tag}`, () =>
			run(mockLayer(() => json({}, status)), (c) => c.get("movie/1", TmdbList)).pipe(
				Effect.flip,
				Effect.map((error) => assert.strictEqual(error._tag, tag)),
			))
	}

	it.effect("maps an invalid body to TmdbDecodeError", () =>
		run(mockLayer(() => json({ results: "nope" })), (c) => c.get("movie/1", TmdbList)).pipe(
			Effect.flip,
			Effect.map((error) => assert.strictEqual(error._tag, "TmdbDecodeError")),
		))

	it.live("retries transport errors before succeeding", () => {
		let calls = 0
		const layer = TmdbClient.layer.pipe(
			Layer.provide(
				Layer.succeed(
					HttpClient.HttpClient,
					HttpClient.make((request) => {
						calls++
						return calls < 3
							? Effect.fail(
									new HttpClientError.HttpClientError({
										reason: new HttpClientError.TransportError({ request, cause: "ECONNRESET" }),
									}),
								)
							: Effect.succeed(HttpClientResponse.fromWeb(request, json({ results: [] })))
					}),
				),
			),
			Layer.provide(
				ConfigProvider.layer(ConfigProvider.fromUnknown({ TMDB_AUTH_TOKEN: "t" })),
			),
		)
		return run(layer, (c) => c.get("movie/popular", TmdbList)).pipe(
			Effect.map(() => assert.strictEqual(calls, 3)),
		)
	})
})

describe("TmdbClient.layerBrowser", () => {
	it.effect("calls the /api/tmdb proxy without a token", () => {
		// Relative URLs resolve against `location`, which only browsers have.
		vi.stubGlobal("location", new URL("http://localhost/"))
		const seen: Array<URL> = []
		const layer = TmdbClient.layerBrowserBase.pipe(
			Layer.provide(
				Layer.succeed(
					HttpClient.HttpClient,
					HttpClient.make((request, url) => {
						seen.push(url)
						return Effect.succeed(HttpClientResponse.fromWeb(request, json({ results: [{ id: 7 }] })))
					}),
				),
			),
		)
		return run(layer, (c) => c.get("/search/movie?query=a", TmdbList)).pipe(
			Effect.map((list) => {
				assert.strictEqual(seen[0].pathname, "/api/tmdb/search/movie")
				assert.strictEqual(seen[0].searchParams.get("query"), "a")
				assert.strictEqual(list.results[0].id, 7)
			}),
		)
	})
})

