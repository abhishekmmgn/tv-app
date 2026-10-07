import { runServerOrNull } from "@/lib/effect/runtime";
import { TmdbCredits, TmdbVideos } from "@/lib/effect/schemas";
import { tmdbGet } from "@/lib/effect/tmdb";
import CardGallery from "../gallery/card-gallery";

async function getData(itemType: string, itemId: string) {
	const [videos, credits] = await Promise.all([
		runServerOrNull(tmdbGet(`${itemType}/${itemId}/videos`, TmdbVideos)),
		runServerOrNull(tmdbGet(`${itemType}/${itemId}/credits`, TmdbCredits)),
	]);
	return { videos, credits };
}

export default async function DetailsWrapper({
	itemType,
	itemId,
}: {
	itemType: string;
	itemId: string;
}) {
	const { videos, credits } = await getData(itemType, itemId);

	return (
		<>
			<CardGallery title="Videos" type="video" data={videos} />
			<CardGallery title="Cast" type="credits" data={credits} />
		</>
	);
}
