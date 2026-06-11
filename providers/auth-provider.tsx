"use client";

import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	User,
} from "firebase/auth";
import { deleteUser } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase-config";

interface AuthContextType {
	user: any;
	isLoading: boolean;
	googleSignIn: () => void;
	logOut: () => void;
	deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const googleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			if (user) {
				const userDocRef = doc(db, "users", user.uid);
				const userDocSnap = await getDoc(userDocRef);
				if (!userDocSnap.exists()) {
					await setDoc(userDocRef, {
						name: user.displayName,
						watchlist: [],
					});
				}
			}
		} catch (err) {
			return err;
		}
	};

	const logOut = () => {
		signOut(auth);
	};

	const deleteAccount = async () => {
		const user = auth.currentUser;
		if (user) {
			const userDocRef = doc(db, "users", user.uid);

			// Backup the user's data first
			const userDocSnap = await getDoc(userDocRef);
			const userData = userDocSnap.data();

			// Delete data
			await deleteDoc(userDocRef);

			try {
				// Attempt to delete the account
				await deleteUser(user);
			} catch (error) {
				// If account deletion fails (e.g. requires-recent-login), restore the data
				if (userData) await setDoc(userDocRef, userData);

				throw error; // Pass the error up to the UI
			}
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setIsLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user, isLoading, googleSignIn, logOut, deleteAccount }}>
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
