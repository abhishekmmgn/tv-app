import { Schema } from "effect"

// TMDB payloads vary a lot between endpoints and movie/tv, so every field
// except `id` is optional and unknown keys are ignored. TMDB sends `null` for
// missing images/text, hence the NullOr wrappers.
export const MediaType = Schema.Literals(["movie", "tv"])

const NullableString = Schema.optional(Schema.NullOr(Schema.String))

export const TmdbItem = Schema.Struct({
	id: Schema.Number,
	title: Schema.optional(Schema.String),
	name: Schema.optional(Schema.String),
	original_title: Schema.optional(Schema.String),
	original_name: Schema.optional(Schema.String),
	original_language: Schema.optional(Schema.String),
	tagline: NullableString,
	overview: NullableString,
	poster_path: NullableString,
	backdrop_path: NullableString,
	media_type: Schema.optional(MediaType),
	adult: Schema.optional(Schema.Boolean),
	video: Schema.optional(Schema.Boolean),
	release_date: Schema.optional(Schema.String),
	first_air_date: Schema.optional(Schema.String),
	genre_ids: Schema.optional(Schema.Array(Schema.Number)),
	origin_country: Schema.optional(Schema.Array(Schema.String)),
	popularity: Schema.optional(Schema.Number),
	runtime: Schema.optional(Schema.NullOr(Schema.Number)),
})
export type TmdbItem = typeof TmdbItem.Type

export const TmdbList = Schema.Struct({
	page: Schema.optional(Schema.Number),
	results: Schema.Array(TmdbItem),
	total_pages: Schema.optional(Schema.Number),
	total_results: Schema.optional(Schema.Number),
})
export type TmdbList = typeof TmdbList.Type

const Genre = Schema.Struct({ id: Schema.Number, name: Schema.String })
const Network = Schema.Struct({
	id: Schema.Number,
	name: Schema.String,
	logo_path: NullableString,
	origin_country: Schema.optional(Schema.String),
})

const Company = Schema.Struct({
	id: Schema.Number,
	name: Schema.String,
	logo_path: NullableString,
	origin_country: Schema.optional(Schema.String),
})

export const TmdbDetails = Schema.Struct({
	...TmdbItem.fields,
	belongs_to_collection: Schema.optional(Schema.NullOr(Schema.Struct({
		id: Schema.Number,
		name: Schema.String,
		poster_path: NullableString,
		backdrop_path: NullableString,
	}))),
	production_companies: Schema.optional(Schema.Array(Company)),
	genres: Schema.optional(Schema.Array(Genre)),
	networks: Schema.optional(Schema.Array(Network)),
	status: Schema.optional(Schema.String),
	homepage: Schema.optional(Schema.NullOr(Schema.String)),
	budget: Schema.optional(Schema.Number),
	revenue: Schema.optional(Schema.Number),
	episode_run_time: Schema.optional(Schema.Array(Schema.Number)),
	number_of_seasons: Schema.optional(Schema.Number),
	number_of_episodes: Schema.optional(Schema.Number),
	seasons: Schema.optional(Schema.Array(Schema.Struct({
		id: Schema.Number,
		name: Schema.optional(Schema.String),
		season_number: Schema.optional(Schema.Number),
		episode_count: Schema.optional(Schema.Number),
		poster_path: NullableString,
		overview: NullableString,
		air_date: NullableString,
	}))),
})
export type TmdbDetails = typeof TmdbDetails.Type

export const TmdbVideos = Schema.Struct({
	results: Schema.Array(Schema.Struct({
		id: Schema.String,
		key: Schema.String,
		name: Schema.optional(Schema.String),
		site: Schema.optional(Schema.String),
		type: Schema.optional(Schema.String),
		official: Schema.optional(Schema.Boolean),
	})),
})
export type TmdbVideos = typeof TmdbVideos.Type

const CreditPerson = Schema.Struct({
	name: Schema.String,
	profile_path: NullableString,
	character: Schema.optional(Schema.String),
	job: Schema.optional(Schema.String),
})

export const TmdbCredits = Schema.Struct({
	cast: Schema.Array(CreditPerson),
	crew: Schema.Array(CreditPerson),
})
export type TmdbCredits = typeof TmdbCredits.Type

export const TmdbSeason = Schema.Struct({
	episodes: Schema.optional(Schema.Array(Schema.Struct({
		episode_number: Schema.Number,
		name: Schema.optional(Schema.String),
		overview: NullableString,
		still_path: NullableString,
		runtime: Schema.optional(Schema.NullOr(Schema.Number)),
	}))),
})
export type TmdbSeason = typeof TmdbSeason.Type

// Details with `append_to_response=content_ratings|release_dates,videos,credits,recommendations`
export const TmdbDetailsFull = Schema.Struct({
	...TmdbDetails.fields,
	content_ratings: Schema.optional(Schema.Struct({
		results: Schema.Array(Schema.Struct({
			iso_3166_1: Schema.String,
			rating: Schema.optional(Schema.String),
		})),
	})),
	release_dates: Schema.optional(Schema.Struct({
		results: Schema.Array(Schema.Struct({
			iso_3166_1: Schema.String,
			release_dates: Schema.Array(Schema.Struct({
				certification: Schema.optional(Schema.String),
			})),
		})),
	})),
	videos: Schema.optional(TmdbVideos),
	credits: Schema.optional(TmdbCredits),
	recommendations: Schema.optional(TmdbList),
})
export type TmdbDetailsFull = typeof TmdbDetailsFull.Type

// Entries of `users/{uid}.watchlist` in Firestore.
export const WatchItem = Schema.Struct({ id: Schema.Number, type: MediaType })
export type WatchItem = typeof WatchItem.Type
