import { fetchTMDBData } from "@/lib/requests";
import CardGallery from "../gallery/card-gallery";

async function getData(itemType: string, itemId: string) {
	const promises = [
		fetchTMDBData(`${itemType}/${itemId}/videos`),
		fetchTMDBData(`${itemType}/${itemId}/credits`),
	];
	const [videos, credits] = await Promise.all(promises);
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
