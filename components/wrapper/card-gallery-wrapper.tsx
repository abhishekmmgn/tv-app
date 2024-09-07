import { fetchTMDBData } from "@/lib/requests";
import CardGallery from "../gallery/card-gallery";
import type { ItemType } from "@/types";

export const dynamic = "force-dynamic";

type PropsType = {
  title: string;
  url: string;
  type: ItemType;
};

export default async function CardGalleryWrapper(props: PropsType) {
  const data = await fetchTMDBData(props.url);
  return <CardGallery data={data} title={props.title} type={props.type} />;
}
