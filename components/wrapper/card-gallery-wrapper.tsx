import { fetchTMDBData } from "@/lib/requests";
import type { CardType } from "@/types";
import CardGallery from "../gallery/card-gallery";

export const dynamic = "force-dynamic";

type PropsType = {
	title: string;
	url: string;
	type: CardType;
};

export default async function CardGalleryWrapper(props: PropsType) {
	const data = await fetchTMDBData(props.url);
	return <CardGallery data={data} title={props.title} type={props.type} />;
}
