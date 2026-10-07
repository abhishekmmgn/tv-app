"use client";

import { useBrowserEffect } from "@/hooks/use-effect";
import { libraryItems } from "@/lib/effect/watchlist-items";
import { UserAuth } from "@/providers/auth-provider";
import { useMemo } from "react";
import CardGallery from "./gallery/card-gallery";
import { CardGallerySkeleton } from "./skeletons";

export default function Library() {
	const { user } = UserAuth();
	const effect = useMemo(() => (user ? libraryItems(user.uid) : null), [user]);
	const { data, loading } = useBrowserEffect(effect);

	if (loading) {
		return <CardGallerySkeleton title="Library" type="poster" />;
	}
	if (data?.length) {
		return <CardGallery title="Library" type="poster" data={data} />;
	}
	return <></>;
}
