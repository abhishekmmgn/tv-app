import DetailsCard from "@/components/cards/details-card";
import { TmdbDetailsFull } from "@/lib/effect/schemas";
import { runServer, runServerOrNull } from "@/lib/effect/runtime";
import { tmdbGet } from "@/lib/effect/tmdb";
import type { ItemType } from "@/types";
import type { Metadata } from "next";

type Params = {
	params: Promise<{
		id: string;
	}>;
};

const detailsEndpoint = (type: string, itemId: string) => {
	const appendKeys = [
		type === "tv" ? "content_ratings" : "release_dates",
		"videos",
		"credits",
		"recommendations",
	].join(",");
	return `${type}/${itemId}?append_to_response=${appendKeys}`;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
	const { id } = await props.params;
	const [type, name, itemId] = id.split("-");

	const res = await runServerOrNull(
		tmdbGet(detailsEndpoint(type, itemId), TmdbDetailsFull),
	);
	if (!res) {
		return {
			title: "Not found",
			description: "The movie is not available or does not exist",
		};
	}

	const { tagline, backdrop_path, poster_path } = res;
	const image = `https://image.tmdb.org/t/p/w300${backdrop_path || poster_path}`;
	return {
		title: name,
		description: tagline ?? undefined,
		openGraph: {
			images: image,
			title: name,
			description: tagline ?? undefined,
			url: `https://tv-app-beta.vercel.app/${type}-${name}-${itemId}`,
			siteName: "TV App",
			locale: "en_US",
			type: "website",
		},
	};
}

const certificationOf = (
	type: string,
	details: TmdbDetailsFull,
): string | undefined => {
	if (type === "tv") {
		return details.content_ratings?.results.find((r) => r.iso_3166_1 === "US")
			?.rating;
	}
	return details.release_dates?.results
		.find((r) => r.iso_3166_1 === "US")
		?.release_dates.find((d) => d.certification)?.certification;
};

export default async function MovieDetails(props: Params) {
	const { id } = await props.params;
	const [type, , itemId] = id.split("-");

	// A TMDB 404 becomes Next's notFound(); other failures reach the error boundary.
	const details = await runServer(
		tmdbGet(detailsEndpoint(type, itemId), TmdbDetailsFull),
	);

	return (
		<DetailsCard
			details={details}
			type={type as ItemType}
			certification={certificationOf(type, details)}
		/>
	);
}
