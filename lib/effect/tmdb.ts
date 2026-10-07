import { Context, Effect, Layer, Redacted, Schedule, Schema } from "effect"
import {
	FetchHttpClient,
	HttpClient,
	HttpClientRequest,
	type HttpClientResponse,
} from "effect/http"
import { TmdbConfig } from "./config"
import {
	TmdbDecodeError,
	type TmdbError,
	TmdbHttpError,
	TmdbNetworkError,
	TmdbNotFound,
	TmdbUnauthorized,
} from "./errors"

export interface TmdbGetOptions {
	/** Seconds for Next's fetch cache. Defaults to the end of the day. */
	readonly revalidate?: number | false
}

export const secondsUntilEndOfDay = (now: Date = new Date()): number => {
	const midnight = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + 1,
	)
	return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

// Adds `include_adult=false` to search/discover endpoints unless the caller
// already set it, and normalises the leading slash.
export const buildTmdbUrl = (baseUrl: string, endpoint: string): URL => {
	const url = new URL(`${baseUrl}/${endpoint.replace(/^\/+/, "")}`)
	if (
		(endpoint.includes("search/") || endpoint.includes("discover/")) &&
		!url.searchParams.has("include_adult")
	) {
		url.searchParams.set("include_adult", "false")
	}
	return url
}

// Maps an HTTP response to typed TMDB errors and decodes the JSON body.
const decodeResponse = Effect.fnUntraced(function* <A>(
	endpoint: string,
	response: HttpClientResponse.HttpClientResponse,
	schema: Schema.Decoder<A>,
): Effect.fn.Return<A, TmdbError> {
	if (response.status === 404) return yield* new TmdbNotFound({ endpoint })
	if (response.status === 401) return yield* new TmdbUnauthorized({ endpoint })
	if (response.status < 200 || response.status >= 300) {
		return yield* new TmdbHttpError({ endpoint, status: response.status })
	}
	const json = yield* response.json.pipe(
		Effect.mapError((cause) => new TmdbDecodeError({ endpoint, cause })),
	)
	return yield* Schema.decodeUnknownEffect(schema)(json).pipe(
		Effect.mapError((cause) => new TmdbDecodeError({ endpoint, cause })),
	)
})

// Retry only transport failures (connection resets etc.); HTTP statuses are
// mapped to typed errors by decodeResponse instead.
const withRetry = (client: HttpClient.HttpClient) =>
	client.pipe(
		HttpClient.retryTransient({
			retryOn: "errors-only",
			schedule: Schedule.exponential(100),
			times: 3,
		}),
	)

export class TmdbClient extends Context.Service<
	TmdbClient,
	{
		get<A>(
			endpoint: string,
			schema: Schema.Decoder<A>,
			options?: TmdbGetOptions,
		): Effect.Effect<A, TmdbError>
	}
>()("tv-app/TmdbClient") {
	static readonly layer = Layer.effect(
		TmdbClient,
		Effect.gen(function* () {
			const config = yield* TmdbConfig
			const client = withRetry(yield* HttpClient.HttpClient)

			const get = Effect.fn("TmdbClient.get")(function* <A>(
				endpoint: string,
				schema: Schema.Decoder<A>,
				options?: TmdbGetOptions,
			) {
				const url = buildTmdbUrl(config.baseUrl, endpoint)
				const request = HttpClientRequest.get(url).pipe(
					HttpClientRequest.acceptJson,
					HttpClientRequest.bearerToken(Redacted.value(config.token)),
				)

				const response = yield* client.execute(request).pipe(
					Effect.provideService(FetchHttpClient.RequestInit, {
						next: { revalidate: options?.revalidate ?? secondsUntilEndOfDay() },
					} as RequestInit),
					Effect.mapError((cause) => new TmdbNetworkError({ endpoint, cause })),
				)

				return yield* decodeResponse(endpoint, response, schema)
			})

			return TmdbClient.of({ get })
		}),
	)

	static readonly layerLive = TmdbClient.layer.pipe(
		Layer.provide(FetchHttpClient.layer),
	)

	// Browser implementation: talks to our own `/api/tmdb/*` proxy, which holds
	// the token and applies the adult filter and caching.
	static readonly layerBrowserBase = Layer.effect(
		TmdbClient,
		Effect.gen(function* () {
			const client = withRetry(yield* HttpClient.HttpClient)

			const get = Effect.fn("TmdbClient.get")(function* <A>(
				endpoint: string,
				schema: Schema.Decoder<A>,
			) {
				const request = HttpClientRequest.get(
					`/api/tmdb/${endpoint.replace(/^\/+/, "")}`,
				).pipe(HttpClientRequest.acceptJson)
				const response = yield* client
					.execute(request)
					.pipe(Effect.mapError((cause) => new TmdbNetworkError({ endpoint, cause })))
				return yield* decodeResponse(endpoint, response, schema)
			})

			return TmdbClient.of({ get })
		}),
	)

	static readonly layerBrowser = TmdbClient.layerBrowserBase.pipe(
		Layer.provide(FetchHttpClient.layer),
	)
}

export const tmdbGet = <A>(
	endpoint: string,
	schema: Schema.Decoder<A>,
	options?: TmdbGetOptions,
) =>
	Effect.gen(function* () {
		const tmdb = yield* TmdbClient
		return yield* tmdb.get(endpoint, schema, options)
	})
