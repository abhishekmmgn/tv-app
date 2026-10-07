import { Context, Effect, Option, type Stream } from "effect"
import type { FirebaseError } from "./errors"
import type { WatchItem } from "./schemas"

// Service interfaces only: the Firebase SDK lives in firebase-live.ts so this
// module (and its tests) never initialise Firebase.

export interface AuthUser {
	readonly uid: string
	readonly displayName: string | null
	readonly email: string | null
	readonly photoURL: string | null
}

export type UserDoc = Record<string, unknown>

export class AuthService extends Context.Service<AuthService, {
	signInWithGoogle: Effect.Effect<void, FirebaseError>
	signOut: Effect.Effect<void, FirebaseError>
	currentUser: Effect.Effect<Option.Option<AuthUser>>
	deleteCurrentUser: Effect.Effect<void, FirebaseError>
	/** Emits the signed-in user (or null) now and on every change. */
	changes: Stream.Stream<AuthUser | null>
}>()("tv-app/AuthService") {}

export class UserStore extends Context.Service<UserStore, {
	/** Reads the watchlist, creating the user doc on first sign-in. */
	loadOrCreate(uid: string, name: string | null): Effect.Effect<ReadonlyArray<WatchItem>, FirebaseError>
	getWatchlist(uid: string): Effect.Effect<ReadonlyArray<WatchItem>, FirebaseError>
	addItem(uid: string, item: WatchItem): Effect.Effect<void, FirebaseError>
	removeItem(uid: string, item: WatchItem): Effect.Effect<void, FirebaseError>
	snapshot(uid: string): Effect.Effect<Option.Option<UserDoc>, FirebaseError>
	deleteDoc(uid: string): Effect.Effect<void, FirebaseError>
	restoreDoc(uid: string, data: UserDoc): Effect.Effect<void, FirebaseError>
}>()("tv-app/UserStore") {}

// Deletes the user's Firestore doc, then the auth account. If deleting the
// account fails (e.g. auth/requires-recent-login) the doc is restored, so the
// user never ends up with an account but no data.
export const deleteAccount = Effect.fn("deleteAccount")(function* () {
	const auth = yield* AuthService
	const store = yield* UserStore

	const user = yield* auth.currentUser
	if (Option.isNone(user)) return
	const { uid } = user.value

	const snapshot = yield* store.snapshot(uid)
	yield* store.deleteDoc(uid)
	yield* auth.deleteCurrentUser.pipe(
		Effect.tapError(() =>
			Option.match(snapshot, {
				onNone: () => Effect.void,
				onSome: (data) =>
					store.restoreDoc(uid, data).pipe(
						Effect.catch((error) => Effect.logError("Failed to restore user doc", error)),
					),
			}),
		),
	)
})
