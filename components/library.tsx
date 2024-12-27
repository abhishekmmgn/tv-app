"use client";

import { auth, db } from "@/firebase-config";
import { fetchTMDBData } from "@/lib/requests";
import type { ItemType } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import CardGallery from "./gallery/card-gallery";
import { CardGallerySkeleton } from "./skeletons";

export default function Library() {
	const [data, setData] = useState<ItemType[]>([]);
	const [loading, setLoading] = useState(false);

	async function fetchLibraryData() {
		setLoading(true);
		const docSnap = await getDoc(doc(db, "users", auth?.currentUser?.uid!));

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
			const returnedData: {
				id: number;
				isAShow: boolean;
			}[] = docSnap.data()?.watchlist || [];
			const items: ItemType[] = [];
			if (returnedData.length) {
				for (const item of returnedData) {
					const details = await fetchTMDBData(
						`${item.isAShow ? "tv" : "movie"}/${item.id}`,
					);
					items.push(details);
				}
				console.log("Items:", items);
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

	console.log(data);

	if (loading) {
		return <CardGallerySkeleton title="Library" type="poster" />;
	}
	if (data.length) {
		return <CardGallery title="Library" type="poster" data={data} />;
	} else {
		return <></>;
	}
}
