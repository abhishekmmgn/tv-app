import { fetchTMDBData } from "@/lib/requests";
import CardGallery from "../gallery/card-gallery";

export const dynamic = "force-dynamic";

type PropsType = {
  title: string;
  url: string;
  type:
    | "video"
    | "category"
    | "credits"
    | "poster"
    | "season"
    | "search-results";
};

export default async function CardGalleryWrapper(props: PropsType) {
  const res = await fetchTMDBData(props.url);
  return (
    <>
      <CardGallery data={res} title={props.title} type={props.type} />
    </>
  );
}
