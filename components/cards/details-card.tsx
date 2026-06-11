import CardGallery from "@/components/gallery/card-gallery";
import { Separator } from "@/components/ui/separator";
import type { DataDetailsType, ItemType } from "@/types";
import Link from "next/link";
import Details from "../details";
import Seasons from "../seasons";
import DetailsSplash from "./details-splash";
import { notFound } from "next/navigation";

export default async function DetailsCard({
	type,
	details,
	certification,
}: {
	type: ItemType;
	details: DataDetailsType;
	certification?: string;
}) {
	if (!details) {
		notFound();
	}
	return (
		<div className="space-y-6">
			<DetailsSplash data={details} type={type} />
			{type === "tv" && (
				<Seasons id={details.id} seasons={details.number_of_seasons} />
			)}

			{(details as any).videos && (
				<CardGallery
					title="Videos"
					type="video"
					data={(details as any).videos}
				/>
			)}
			{(details as any).credits && (
				<CardGallery
					title="Cast and Crew"
					type="credits"
					data={(details as any).credits}
				/>
			)}
			<Details details={details} isAShow={type === "tv"} certification={certification} />
			<div className="horizontal-padding">
				<Separator />
			</div>
			{(details as any).recommendations && (
				<CardGallery
					title={`Recommendations for ${details.title || details.name}`}
					type="poster"
					data={(details as any).recommendations}
				/>
			)}
		</div>
	);
}
