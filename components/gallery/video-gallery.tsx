import VideoCard from "../cards/video-card";
import { galleryType } from "@/types";

export default function VideoCardGallery(props: galleryType) {
  let data = [];
  if (props.data?.results) {
    data = [...props.data.results].reverse();
  }
  return (
    <>
      {data.map((item: any, index: number) => (
        <div key={index}>
          <VideoCard
            title={item.name}
            link={`https://www.youtube.com/embed/${item.key}`}
          />
        </div>
      ))}
    </>
  );
}
