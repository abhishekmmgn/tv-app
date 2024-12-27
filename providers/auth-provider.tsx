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
	googleSignIn: () => void;
	logOut: () => void;
	deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [user, setUser] = useState<User | null>(null);

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
			await deleteDoc(userDocRef);
			await deleteUser(user);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => unsubscribe();
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, googleSignIn, logOut, deleteAccount }}>
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
