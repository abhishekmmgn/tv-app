"use client";
import { useInView } from "@/lib/useInView";
import { useMemo, useState } from "react";
import CardGallery from "./card-gallery";
import { CardGallerySkeleton } from "../skeletons";
import { useBrowserEffect } from "@/hooks/use-effect";
import { TmdbList } from "@/lib/effect/schemas";
import { tmdbGet } from "@/lib/effect/tmdb";
import { CardType } from "@/types";

export default function LazyGallery({
	title,
	type,
	url,
}: {
	title: string;
	type: CardType;
	url: string;
}) {
	const [ref, inView] = useInView({ threshold: 0.2 });
	const [show, setShow] = useState(false);

	// Latch: once seen, keep showing (adjusting state during render, not in an effect).
	if (inView && !show) setShow(true);

	const effect = useMemo(
		() => (show && type !== "category" ? tmdbGet(url, TmdbList) : null),
		[show, url, type],
	);
	const { data, error } = useBrowserEffect(effect);

	if (type === "category") {
		return (
			<div ref={ref}>
				<CardGallery data={[]} title={title} type={type} />
			</div>
		);
	}

	return (
		<div ref={ref}>
			{error ? null : show && data ? (
				<CardGallery data={data} title={title} type={type} />
			) : (
				<CardGallerySkeleton title={title} type={type} />
			)}
		</div>
	);
}
