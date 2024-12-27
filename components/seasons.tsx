"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetchTMDBData } from "@/lib/requests";
import { useEffect, useState } from "react";
import CardGallery from "./gallery/card-gallery";
import { GalleryType } from "@/types";

export default function Seasons({
	id,
	seasons,
}: { id: number; seasons: number }) {
	const [currentSeason, setCurrentSeason] = useState(1);
	const [data, setData] = useState<GalleryType[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetchTMDBData(`tv/${id}/season/${currentSeason}`);
			setData(res.episodes);
		};

		fetchData();
	}, [id, currentSeason]);

	return (
		<div className="space-y-2">
			<Select
				defaultValue="season-1"
				onValueChange={(value) =>
					setCurrentSeason(parseInt(value.split("-")[1]))
				}
			>
				<SelectTrigger className="w-[180px] px-5 md:px-8 xl:px-12">
					<SelectValue placeholder="Season" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{Array.from({ length: seasons }, (_, i) => (
							<SelectItem key={i} value={`season-${i + 1}`}>
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
