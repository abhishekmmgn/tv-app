import CardGallery from "@/components/gallery/card-gallery";
import { Separator } from "@/components/ui/separator";
import type { TmdbDetailsFull } from "@/lib/effect/schemas";
import type { ItemType } from "@/types";
import Link from "next/link";
import Details from "../details";
import Seasons from "../seasons";
import DetailsSplash from "./details-splash";

export default async function DetailsCard({
	type,
	details,
	certification,
}: {
	type: ItemType;
	details: TmdbDetailsFull;
	certification?: string;
}) {
	return (
		<div className="space-y-6">
			<DetailsSplash data={details} type={type} />
			{type === "tv" && (
				<Seasons id={details.id} seasons={details.number_of_seasons ?? 0} />
			)}

			{details.videos && (
				<CardGallery
					title="Videos"
					type="video"
					data={details.videos}
				/>
			)}
			{details.credits && (
				<CardGallery
					title="Cast and Crew"
					type="credits"
					data={details.credits}
				/>
			)}
			<Details details={details} isAShow={type === "tv"} certification={certification} />
			<div className="horizontal-padding">
				<Separator />
			</div>
			{details.recommendations && (
				<CardGallery
					title={`Recommendations for ${details.title || details.name}`}
					type="poster"
					data={details.recommendations}
				/>
			)}
		</div>
	);
}
