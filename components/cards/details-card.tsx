import { CardGalleryWrapper } from "@/components/gallery/card-gallery";
import { Separator } from "@/components/ui/separator";
import type { DataDetailsType, ItemType } from "@/types";
import Link from "next/link";
import { Suspense } from "react";
import Details from "../details";
import Seasons from "../seasons";
import { CardGallerySkeleton } from "../skeletons";
import DetailsSplash from "./details-splash";
import { notFound } from "next/navigation";

export default async function DetailsCard({
	type,
	details,
}: {
	type: ItemType;
	details: DataDetailsType;
}) {
	if (!details) {
		notFound();
	}
	return (
		<div className="space-y-6">
			<DetailsSplash data={details} type={type} />
			{type === "tv" && (
				<Suspense
					fallback={<CardGallerySkeleton title="Seasons" type="season" />}
				>
					<Seasons id={details.id} seasons={details.number_of_seasons} />
				</Suspense>
			)}

			<Suspense fallback={<CardGallerySkeleton title="Videos" type="video" />}>
				<CardGalleryWrapper
					title="Videos"
					type="video"
					url={`${type}/${details.id}/videos`}
				/>
			</Suspense>
			<Suspense
				fallback={<CardGallerySkeleton title="Cast and Crew" type="credits" />}
			>
				<CardGalleryWrapper
					title="Cast and Crew"
					type="credits"
					url={`${type}/${details.id}/credits`}
				/>
			</Suspense>
			<Details details={details} isAShow={type === "tv"} />
			<div className="px-5 md:px-8 xl:px-12">
				<Separator />
			</div>
			<Suspense
				fallback={
					<CardGallerySkeleton
						title={`Recommendations for ${details.title || details.name}`}
						type="poster"
					/>
				}
			>
				<CardGalleryWrapper
					title={`Recommendations for ${details.title || details.name}`}
					type="poster"
					url={`${type}/${details.id}/recommendations`}
				/>
			</Suspense>
		</div>
	);
}
