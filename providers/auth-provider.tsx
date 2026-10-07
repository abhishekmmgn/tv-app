"use client";

import { browserRuntime } from "@/lib/effect/browser";
import {
	type AuthUser,
	AuthService,
	deleteAccount as deleteAccountEffect,
	UserStore,
} from "@/lib/effect/firebase";
import type { WatchItem } from "@/lib/effect/schemas";
import { Effect, Stream } from "effect";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AuthContextType {
	user: AuthUser | null;
	isLoading: boolean;
	watchlist: WatchItem[];
	googleSignIn: () => Promise<void>;
	logOut: () => void;
	deleteAccount: () => Promise<void>;
	isInWatchlist: (id: number) => boolean;
	addToWatchlist: (id: number, type: "movie" | "tv") => Promise<void>;
	removeFromWatchlist: (id: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Closing the popup is the user's choice, not an error worth a toast.
const SILENT_SIGN_IN_CODES = [
	"auth/popup-closed-by-user",
	"auth/cancelled-popup-request",
];

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [watchlist, setWatchlist] = useState<WatchItem[]>([]);

	const googleSignIn = () =>
		browserRuntime.runPromise(
			Effect.gen(function* () {
				const auth = yield* AuthService;
				yield* auth.signInWithGoogle;
			}).pipe(
				Effect.catchTag("FirebaseError", (error) =>
					error.code && SILENT_SIGN_IN_CODES.includes(error.code)
						? Effect.void
						: Effect.sync(() => {
								console.error("Sign in failed:", error);
								toast.error("Sign in failed. Please try again.");
							}),
				),
			),
		);

	const logOut = () => {
		setWatchlist([]);
		void browserRuntime.runPromise(
			Effect.gen(function* () {
				const auth = yield* AuthService;
				yield* auth.signOut;
			}).pipe(
				Effect.catchTag("FirebaseError", (error) =>
					Effect.sync(() => {
						console.error("Sign out failed:", error);
						toast.error("Something went wrong when logging out.");
					}),
				),
			),
		);
	};

	const isInWatchlist = (id: number) => watchlist.some((item) => item.id === id);

	// Optimistic: update local state first, roll back if Firestore rejects. The
	// returned promise rejects with the FirebaseError so callers can toast.
	const addToWatchlist = async (id: number, type: "movie" | "tv") => {
		if (!user) return;
		const item: WatchItem = { id, type };
		const added = !isInWatchlist(id);
		if (added) setWatchlist((prev) => [...prev, item]);
		try {
			await browserRuntime.runPromise(
				Effect.gen(function* () {
					const store = yield* UserStore;
					yield* store.addItem(user.uid, item);
				}),
			);
		} catch (error) {
			if (added) setWatchlist((prev) => prev.filter((w) => w.id !== id));
			throw error;
		}
	};

	const removeFromWatchlist = async (id: number) => {
		if (!user) return;
		const item = watchlist.find((w) => w.id === id);
		if (!item) return;
		setWatchlist((prev) => prev.filter((w) => w.id !== id));
		try {
			await browserRuntime.runPromise(
				Effect.gen(function* () {
					const store = yield* UserStore;
					yield* store.removeItem(user.uid, item);
				}),
			);
		} catch (error) {
			setWatchlist((prev) => (prev.some((w) => w.id === id) ? prev : [...prev, item]));
			throw error;
		}
	};

	// Rejects with the FirebaseError (e.g. code "auth/requires-recent-login").
	const deleteAccount = () => browserRuntime.runPromise(deleteAccountEffect());

	useEffect(() => {
		const controller = new AbortController();
		browserRuntime.runFork(
			Effect.gen(function* () {
				const auth = yield* AuthService;
				const store = yield* UserStore;
				yield* auth.changes.pipe(
					Stream.runForEach(
						Effect.fnUntraced(function* (currentUser) {
							setUser(currentUser);
							const list = currentUser
								? yield* store
										.loadOrCreate(currentUser.uid, currentUser.displayName)
										.pipe(
											Effect.catchTag("FirebaseError", (error) =>
												Effect.logError("Failed to load watchlist", error).pipe(
													Effect.as([] as ReadonlyArray<WatchItem>),
												),
											),
										)
								: [];
							setWatchlist([...list]);
							setIsLoading(false);
						}),
					),
				);
			}),
			{ signal: controller.signal },
		);
		return () => controller.abort();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				watchlist,
				googleSignIn,
				logOut,
				deleteAccount,
				isInWatchlist,
				addToWatchlist,
				removeFromWatchlist,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("UserAuth must be used within an AuthContextProvider");
	}
	return context;
};
