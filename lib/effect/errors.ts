import { Schema } from "effect"

export class TmdbNotFound extends Schema.TaggedError<TmdbNotFound>()(
	"TmdbNotFound",
	{ endpoint: Schema.String },
) {}

export class TmdbUnauthorized extends Schema.TaggedError<TmdbUnauthorized>()(
	"TmdbUnauthorized",
	{ endpoint: Schema.String },
) {}

export class TmdbHttpError extends Schema.TaggedError<TmdbHttpError>()(
	"TmdbHttpError",
	{ endpoint: Schema.String, status: Schema.Number },
) {}

export class TmdbNetworkError extends Schema.TaggedError<TmdbNetworkError>()(
	"TmdbNetworkError",
	{ endpoint: Schema.String, cause: Schema.Defect() },
) {}

export class TmdbDecodeError extends Schema.TaggedError<TmdbDecodeError>()(
	"TmdbDecodeError",
	{ endpoint: Schema.String, cause: Schema.Defect() },
) {}

export type TmdbError =
	| TmdbNotFound
	| TmdbUnauthorized
	| TmdbHttpError
	| TmdbNetworkError
	| TmdbDecodeError

export class FirebaseError extends Schema.TaggedError<FirebaseError>()(
	"FirebaseError",
	{ operation: Schema.String, code: Schema.optional(Schema.String), cause: Schema.Defect() },
) {}
