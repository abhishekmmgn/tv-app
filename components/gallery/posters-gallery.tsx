import PosterCard from "../cards/poster-card";
import { galleryType } from "@/types";

export default function PosterCardGallery(props: galleryType) {
  return (
    <>
      {props.data.results?.slice(0, 10).map((item: any, index: number) => (
        <div key={index}>
          <PosterCard
            image={
              `https://image.tmdb.org/t/p/w342${item.poster_path}` ||
              `https://image.tmdb.org/t/p/w300${item.backdrop_path}`
            }
            id={item.id}
            title={item.title || item.name}
            isAShow={item.first_air_date || item.name}
          />
        </div>
      ))}
    </>
  );
}
