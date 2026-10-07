"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useBrowserEffect } from "@/hooks/use-effect";
import { TmdbSeason } from "@/lib/effect/schemas";
import { tmdbGet } from "@/lib/effect/tmdb";
import { useMemo, useState } from "react";
import CardGallery from "./gallery/card-gallery";

export default function Seasons({
	id,
	seasons,
}: { id: number; seasons: number }) {
	const [currentSeason, setCurrentSeason] = useState(1);
	const effect = useMemo(
		() => tmdbGet(`tv/${id}/season/${currentSeason}`, TmdbSeason),
		[id, currentSeason],
	);
	const { data: season } = useBrowserEffect(effect);
	const data = season?.episodes ?? [];

	return (
		<div className="space-y-2.5">
			<Select
				defaultValue="Season 1"
				onValueChange={(value) =>
					value && setCurrentSeason(parseInt(value.split(" ")[1]))
				}
			>
				<SelectTrigger className="w-45 left-margin">
					<SelectValue placeholder="Season" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{Array.from({ length: seasons }, (_, i) => (
							<SelectItem key={i} value={`Season ${i + 1}`}>
								Season {i + 1}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<CardGallery title="Episodes" type="season" data={data} />
		</div>
	);
}
