import PosterCard from "../cards/poster-card";
import { galleryType } from "@/types";
import noItem from "@/public/no-item.png";

function perfectImage(posterPath: string, backdropPath: string) {
  if (posterPath) {
     return `https://image.tmdb.org/t/p/w342${posterPath}`
 }
  else if(backdropPath) {
    return `https://image.tmdb.org/t/p/w300${backdropPath}`
  } else {
    return noItem
  }
}
export default function PosterCardGallery(props: galleryType) {
  return (
    <>
      {props.data.results?.slice(0, 10).map((item: any, index: number) => (
        <div key={index}>
          <PosterCard
            image={  perfectImage(item.poster_path, item.backdrop_path)
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
