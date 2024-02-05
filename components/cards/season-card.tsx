import Image from "next/image";
import noItemLandscape from "../../public/noItemLandscape.png";

type PropsType = {
  episode_number: number | null;
  name: string;
  image: string;
  overview: string;
  runtime: number | null;
};

export default function SeasonCard(props: PropsType) {
  return (
    <div className="w-[332px] md:w-[348px] xl:w-[356px] rounded-md">
      <div className="relative bg-secondary w-full aspect-video rounded-md mb-2 shadow-sm group">
        <Image
          src={
            props.image !== null
              ? `https://image.tmdb.org/t/p/w500${props.image}`
              : noItemLandscape
          }
          alt={`Poster of ${props.episode_number}`}
          fill
          loading="eager"
          sizes="356px"
          className="object-cover rounded-md"
        />
      </div>
      <div className="w-full h-auto ">
        {props.episode_number !== null && (
          <small className="italic text-secondary-foreground/60">
            {props.episode_number}
          </small>
        )}
        <h1 className="text-sm font-semibold line-clamp-1 mr-1 md:text-sm+">
          {props.name}
        </h1>
        <p className="text-sm text-secondary-foreground/80 mr-1 whitespace-normal break-words md:text-sm+">
          {props.overview}
        </p>
        {props.runtime !== null && (
          <small className="text-secondary-foreground/60">
            {props.runtime / 60 >= 1 && `${Math.floor(props.runtime / 60)} hr`}{" "}
            {props.runtime % 60 > 0 && `${Math.floor(props.runtime % 60)} min`}
          </small>
        )}
      </div>
    </div>
  );
}
