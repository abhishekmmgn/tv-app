"use client";

import { auth, db } from "@/firebase-config";
import { fetchTMDBData } from "@/lib/requests";
import type { ItemType } from "@/types";
import { useEffect, useState } from "react";
import CardGallery from "./gallery/card-gallery";
import { CardGallerySkeleton } from "./skeletons";

export default function Library() {
	const [data, setData] = useState<ItemType[]>([]);
	const [loading, setLoading] = useState(false);

	async function fetchLibraryData() {
		setLoading(true);
		const { doc, getDoc } = await import("firebase/firestore");
		const docSnap = await getDoc(doc(db, "users", auth?.currentUser?.uid!));

		if (docSnap.exists()) {
			const returnedData: {
				id: number;
				type: ItemType;
			}[] = docSnap.data()?.watchlist || [];
			const items: ItemType[] = [];
			if (returnedData.length) {
				for (const item of returnedData) {
					const details = await fetchTMDBData(`${item.type}/${item.id}`);
					items.push(details);
				}
				setData(items);
			}
			setLoading(false);
		} else {
			setLoading(false);
		}
	}
	useEffect(() => {
		if (auth?.currentUser) {
			fetchLibraryData();
		}
	}, [auth?.currentUser]);

	if (loading) {
		return <CardGallerySkeleton title="Library" type="poster" />;
	}
	if (data.length) {
		return <CardGallery title="Library" type="poster" data={data} />;
	} else {
		return <></>;
	}
}
