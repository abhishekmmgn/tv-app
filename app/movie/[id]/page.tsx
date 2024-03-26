import type { Metadata } from "next";
import DetailsCard from "@/components/cards/details-card";
import { fetchTMDBData } from "@/lib/requests";

type Params = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const parts = id.split("-");
  const movieId = parts.pop();

  try {
    const res = await fetchTMDBData(`movie/${movieId}`);

    const { name, title, overview, tagline, backdrop_path, profile_path } = res;
    const image = `https://image.tmdb.org/t/p/w300${
      backdrop_path || profile_path
    }`;

    return {
      title: title || name,
      description: overview || tagline,
      openGraph: {
        images: image,
        title: title || name,
        description: overview || tagline,
        url: `https://tv-app-beta.vercel.app/movie/${id}`,
        siteName: "TV App",
        locale: "en_US",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Not found",
      description: "The movie is not available or does not exist",
    };
  }
}

export default function MovieDetails({ params: { id } }: Params) {
  const parts = id.split("-");
  const movieId = parts.pop() || "";
  return (
    <>
      <DetailsCard id={movieId.toString()} isAShow={false} />
    </>
  );
}
