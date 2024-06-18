import DetailsSplash from "./details-splash";
import CardGalleryWrapper from "../wrapper/card-gallery-wrapper";
import { Separator } from "@/components/ui/separator";
import { fetchTMDBData } from "@/lib/requests";
import Seasons from "../seasons";
import Link from "next/link";
import Details from "../details";
import MovieRecommendations from "../movie-recommendations";

export default async function DetailsCard(props: {
  id: string;
  isAShow: boolean;
}) {
  let item: "tv" | "movie" = props.isAShow ? "tv" : "movie";

  const details = await fetchTMDBData(`${item}/${props.id}`);

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
  } else {
    return (
      <div className="space-y-6">
        <DetailsSplash
          id={parseInt(props.id)}
          title={details.title || details.name}
          images={{
            backdrop_path: details.backdrop_path,
            poster_path: details.poster_path,
          }}
          tagline={details.tagline}
          overview={details.overview}
          isAShow={details.number_of_seasons ? true : false}
        />
        {props.isAShow && (
          <Seasons id={props.id} seasons={details.number_of_seasons} />
        )}

        <CardGalleryWrapper
          title="Videos"
          type="video"
          url={`${item}/${props.id}/videos`}
        />
        <CardGalleryWrapper
          title="Cast and Crew"
          type="credits"
          url={`${item}/${props.id}/credits`}
        />
        <Details details={details} isAShow={props.isAShow} />

        <div className="px-5 md:px-8 xl:px-12">
          <Separator />
        </div>
        <MovieRecommendations
          title={details.title}
          name={details.name}
          id={props.id}
          item={item}
        />
      </div>
    );
  }
}
