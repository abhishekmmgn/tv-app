import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Option, Stream } from "effect"
import { FirebaseError } from "./errors"
import { type AuthUser, AuthService, deleteAccount, type UserDoc, UserStore } from "./firebase"

const alice: AuthUser = { uid: "alice", displayName: "Alice", email: null, photoURL: null }

// In-memory fakes. `calls` records the order of side effects.
const makeFakes = (options: {
	signedIn?: boolean
	deleteUserFails?: boolean
	restoreFails?: boolean
	doc?: UserDoc
}) => {
	const calls: Array<string> = []
	let doc: UserDoc | undefined = options.doc ?? { name: "Alice", watchlist: [{ id: 1, type: "movie" }] }

	const fail = (operation: string, code?: string) =>
		Effect.fail(new FirebaseError({ operation, code, cause: operation }))

	const auth = Layer.succeed(
		AuthService,
		AuthService.of({
			signInWithGoogle: Effect.void,
			signOut: Effect.void,
			currentUser: Effect.succeed(options.signedIn === false ? Option.none() : Option.some(alice)),
			deleteCurrentUser: Effect.suspend(() => {
				calls.push("deleteUser")
				return options.deleteUserFails
					? fail("deleteUser", "auth/requires-recent-login")
					: Effect.void
			}),
			changes: Stream.empty,
		}),
	)

	const store = Layer.succeed(
		UserStore,
		UserStore.of({
			loadOrCreate: () => Effect.succeed([]),
			getWatchlist: () => Effect.succeed([]),
			addItem: () => Effect.void,
			removeItem: () => Effect.void,
			snapshot: () => Effect.sync(() => Option.fromNullishOr(doc)),
			deleteDoc: () =>
				Effect.sync(() => {
					calls.push("deleteDoc")
					doc = undefined
				}),
			restoreDoc: (_uid, data) =>
				Effect.suspend(() => {
					calls.push("restoreDoc")
					if (options.restoreFails) return fail("restoreDoc")
					doc = data
					return Effect.void
				}),
		}),
	)

	return { calls, layer: Layer.mergeAll(auth, store), getDoc: () => doc }
}

describe("deleteAccount", () => {
	it.effect("deletes the doc, then the account", () => {
		const fakes = makeFakes({})
		return deleteAccount().pipe(
			Effect.provide(fakes.layer),
			Effect.map(() => {
				assert.deepStrictEqual(fakes.calls, ["deleteDoc", "deleteUser"])
				assert.isUndefined(fakes.getDoc())
			}),
		)
	})

	it.effect("restores the doc and surfaces the error when deleting the account fails", () => {
		const original = { name: "Alice", watchlist: [{ id: 1, type: "movie" }] }
		const fakes = makeFakes({ deleteUserFails: true, doc: original })
		return deleteAccount().pipe(
			Effect.provide(fakes.layer),
			Effect.flip,
			Effect.map((error) => {
				assert.strictEqual(error._tag, "FirebaseError")
				assert.strictEqual(error.code, "auth/requires-recent-login")
				assert.deepStrictEqual(fakes.calls, ["deleteDoc", "deleteUser", "restoreDoc"])
				assert.deepStrictEqual(fakes.getDoc(), original)
			}),
		)
	})

	it.effect("still reports the original error when the restore also fails", () => {
		const fakes = makeFakes({ deleteUserFails: true, restoreFails: true })
		return deleteAccount().pipe(
			Effect.provide(fakes.layer),
			Effect.flip,
			Effect.map((error) => assert.strictEqual(error.code, "auth/requires-recent-login")),
		)
	})

	it.effect("does nothing when nobody is signed in", () => {
		const fakes = makeFakes({ signedIn: false })
		return deleteAccount().pipe(
			Effect.provide(fakes.layer),
			Effect.map(() => assert.deepStrictEqual(fakes.calls, [])),
		)
	})

	it.effect("does not restore when there was no doc to begin with", () => {
		const fakes = makeFakes({ deleteUserFails: true })
		// Simulate "no doc": snapshot returns None.
		const noDoc = Layer.succeed(
			UserStore,
			UserStore.of({
				loadOrCreate: () => Effect.succeed([]),
				getWatchlist: () => Effect.succeed([]),
				addItem: () => Effect.void,
				removeItem: () => Effect.void,
				snapshot: () => Effect.succeed(Option.none()),
				deleteDoc: () => Effect.void,
				restoreDoc: () => Effect.sync(() => void fakes.calls.push("restoreDoc")),
			}),
		)
		return deleteAccount().pipe(
			Effect.provide(Layer.merge(fakes.layer, noDoc)),
			Effect.flip,
			Effect.map(() => assert.isFalse(fakes.calls.includes("restoreDoc"))),
		)
	})
})
