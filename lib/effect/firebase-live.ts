import { auth, db } from "@/firebase-config"
import { Effect, Layer, Option, Predicate, Queue, Schema, Stream } from "effect"
import { FirebaseError } from "./errors"
import { type AuthUser, AuthService, UserStore } from "./firebase"
import { WatchItem } from "./schemas"

const codeOf = (cause: unknown): string | undefined =>
	Predicate.hasProperty(cause, "code") && Predicate.isString(cause.code)
		? cause.code
		: undefined

const attempt = <A>(operation: string, f: () => Promise<A>) =>
	Effect.tryPromise({
		try: f,
		catch: (cause) => new FirebaseError({ operation, code: codeOf(cause), cause }),
	})

// Firestore is imported lazily to keep it out of the initial bundle.
const firestore = () => import("firebase/firestore")
const authSdk = () => import("firebase/auth")

const decodeWatchlist = (operation: string, raw: unknown) =>
	Schema.decodeUnknownEffect(Schema.Array(WatchItem))(raw ?? []).pipe(
		Effect.mapError((cause) => new FirebaseError({ operation, cause })),
	)

export const AuthServiceLive = Layer.succeed(
	AuthService,
	AuthService.of({
		signInWithGoogle: attempt("signInWithGoogle", async () => {
			const { GoogleAuthProvider, signInWithPopup } = await authSdk()
			await signInWithPopup(auth, new GoogleAuthProvider())
		}),
		signOut: attempt("signOut", async () => {
			const { signOut } = await authSdk()
			await signOut(auth)
		}),
		currentUser: Effect.sync(() => Option.fromNullishOr(auth.currentUser)),
		deleteCurrentUser: attempt("deleteUser", async () => {
			const { deleteUser } = await authSdk()
			if (auth.currentUser) await deleteUser(auth.currentUser)
		}),
		changes: Stream.callback<AuthUser | null>(
			Effect.fn(function* (queue) {
				const { onAuthStateChanged } = yield* Effect.promise(authSdk)
				yield* Effect.acquireRelease(
					Effect.sync(() =>
						onAuthStateChanged(auth, (user) => Queue.offerUnsafe(queue, user)),
					),
					(unsubscribe) => Effect.sync(unsubscribe),
				)
			}),
		),
	}),
)

export const UserStoreLive = Layer.succeed(
	UserStore,
	UserStore.of({
		getWatchlist: Effect.fn("UserStore.getWatchlist")(function* (uid: string) {
			const raw = yield* attempt("getWatchlist", async () => {
				const { doc, getDoc } = await firestore()
				const snap = await getDoc(doc(db, "users", uid))
				return snap.exists() ? snap.data()?.watchlist : []
			})
			return yield* decodeWatchlist("getWatchlist", raw)
		}),
		loadOrCreate: Effect.fn("UserStore.loadOrCreate")(function* (
			uid: string,
			name: string | null,
		) {
			const raw = yield* attempt("loadOrCreate", async () => {
				const { doc, getDoc, setDoc } = await firestore()
				const ref = doc(db, "users", uid)
				const snap = await getDoc(ref)
				if (!snap.exists()) {
					await setDoc(ref, { name, watchlist: [] })
					return []
				}
				return snap.data()?.watchlist
			})
			return yield* decodeWatchlist("loadOrCreate", raw)
		}),
		addItem: (uid, item) =>
			attempt("addItem", async () => {
				const { arrayUnion, doc, setDoc } = await firestore()
				await setDoc(doc(db, "users", uid), { watchlist: arrayUnion(item) }, { merge: true })
			}),
		removeItem: (uid, item) =>
			attempt("removeItem", async () => {
				const { arrayRemove, doc, setDoc } = await firestore()
				await setDoc(doc(db, "users", uid), { watchlist: arrayRemove(item) }, { merge: true })
			}),
		snapshot: (uid) =>
			attempt("snapshot", async () => {
				const { doc, getDoc } = await firestore()
				const snap = await getDoc(doc(db, "users", uid))
				return Option.fromNullishOr(snap.data())
			}),
		deleteDoc: (uid) =>
			attempt("deleteDoc", async () => {
				const { deleteDoc, doc } = await firestore()
				await deleteDoc(doc(db, "users", uid))
			}),
		restoreDoc: (uid, data) =>
			attempt("restoreDoc", async () => {
				const { doc, setDoc } = await firestore()
				await setDoc(doc(db, "users", uid), data)
			}),
	}),
)
