"use client";

import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	User,
	deleteUser,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase-config";

interface WatchlistItem {
	id: number;
	type: "movie" | "tv";
}

interface AuthContextType {
	user: any;
	isLoading: boolean;
	watchlist: WatchlistItem[];
	googleSignIn: () => void;
	logOut: () => void;
	deleteAccount: () => Promise<void>;
	isInWatchlist: (id: number) => boolean;
	addToWatchlist: (id: number, type: "movie" | "tv") => Promise<void>;
	removeFromWatchlist: (id: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

	const googleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
		} catch (err) {
			return err;
		}
	};

	const logOut = () => {
		signOut(auth);
		setWatchlist([]);
	};

	const isInWatchlist = (id: number) => {
		return watchlist.some((item) => item.id === id);
	};

	const addToWatchlist = async (id: number, type: "movie" | "tv") => {
		if (!user) return;
		const newItem = { id, type };
		if (!isInWatchlist(id)) {
			setWatchlist((prev) => [...prev, newItem]);
		}
		const { arrayUnion, doc, setDoc } = await import("firebase/firestore");
		const userDocRef = doc(db, "users", user.uid);
		await setDoc(userDocRef, { watchlist: arrayUnion(newItem) }, { merge: true });
	};

	const removeFromWatchlist = async (id: number) => {
		if (!user) return;
		const item = watchlist.find((w) => w.id === id);
		if (item) {
			setWatchlist((prev) => prev.filter((w) => w.id !== id));
		}
		const { arrayRemove, doc, setDoc } = await import("firebase/firestore");
		const userDocRef = doc(db, "users", user.uid);
		await setDoc(
			userDocRef,
			{ watchlist: arrayRemove(item) },
			{ merge: true },
		);
	};

	const deleteAccount = async () => {
		const user = auth.currentUser;
		if (user) {
			const { deleteDoc, doc, getDoc, setDoc } = await import(
				"firebase/firestore"
			);
			const userDocRef = doc(db, "users", user.uid);

			const userDocSnap = await getDoc(userDocRef);
			const userData = userDocSnap.data();

			await deleteDoc(userDocRef);

			try {
				await deleteUser(user);
			} catch (error) {
				if (userData) await setDoc(userDocRef, userData);
				throw error;
			}
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				const { doc, getDoc } = await import("firebase/firestore");
				const userDocRef = doc(db, "users", currentUser.uid);
				const userDocSnap = await getDoc(userDocRef);
				const userData = userDocSnap.data();
				if (userData?.watchlist) {
					setWatchlist(userData.watchlist);
				} else if (!userDocSnap.exists()) {
					const { setDoc } = await import("firebase/firestore");
					await setDoc(userDocRef, {
						name: currentUser.displayName,
						watchlist: [],
					});
				}
			} else {
				setWatchlist([]);
			}
			setIsLoading(false);
		});
		return () => unsubscribe();
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
