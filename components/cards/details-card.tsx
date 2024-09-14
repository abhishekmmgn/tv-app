import { CardGalleryWrapper } from "@/components/gallery/card-gallery";
import { Separator } from "@/components/ui/separator";
import type { DetailsType, ItemType } from "@/types";
import Link from "next/link";
import { Suspense } from "react";
import Details from "../details";
import Seasons from "../seasons";
import { CardGallerySkeleton } from "../skeletons";
import DetailsSplash from "./details-splash";

export default async function DetailsCard({
	type,
	details,
}: {
	type: ItemType;
	details: DetailsType;
}) {
	if (details === null) {
		return (
			<div className="h-[90vh] w-full flex flex-col items-center justify-center gap-2">
				<h1 className="md:text-base+">
					The movie or show you&apos;re looking for doesn&apos;t exist.
				</h1>
				<Link href="/" className="text-accent hover:underline">
					Navigate to home
				</Link>
			</div>
		);
	} else if (details === undefined) {
		return (
			<div className="h-[90vh] w-full flex flex-col items-center justify-center gap-2">
				<h1 className="md:text-base+ text-destructive">Something went wrong</h1>
				<Link href="/" className="text-accent hover:underline">
					Navigate to home
				</Link>
			</div>
		);
	} else {
		return (
			<div className="space-y-6">
				<DetailsSplash
					id={parseInt(details.id)}
					title={details.name}
					images={{
						backdrop_path: details.backdrop_path,
						poster_path: details.poster_path,
					}}
					tagline={details.tagline}
					overview={details.overview}
					isAShow={details.number_of_seasons ? true : false}
				/>
				{type === "tv" && (
					<Seasons id={details.id} seasons={details.number_of_seasons} />
				)}
				<Suspense
					fallback={<CardGallerySkeleton title="Videos" type="video" />}
				>
					<CardGalleryWrapper
						title="Videos"
						type="video"
						url={`${type}/${details.id}/videos`}
					/>
				</Suspense>
				<Suspense
					fallback={
						<CardGallerySkeleton title="Cast and Crew" type="credits" />
					}
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
}
