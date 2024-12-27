import DetailsCard from "@/components/cards/details-card";
import { fetchTMDBData } from "@/lib/requests";
import type { DataDetailsType, DataListType, ItemType } from "@/types";
import type { Metadata } from "next";

type Params = {
	params: {
		id: string;
	};
};

export async function generateMetadata({
	params: { id },
}: Params): Promise<Metadata> {
	const parts = id.split("-");

	const type: string = parts[0];
	const name: string = parts[1];
	const itemId: string = parts[2];

	try {
		const res: DataListType = await fetchTMDBData(`${type}/${itemId}`);
		const { name, tagline, backdrop_path, poster_path } = res;
		const image = `https://image.tmdb.org/t/p/w300${
			backdrop_path || poster_path
		}`;
		return {
			title: name,
			description: tagline,
			openGraph: {
				images: image,
				title: name,
				description: tagline,
				url: `https://tv-app-beta.vercel.app/${type}-${name}-${itemId}`,
				siteName: "TV App",
				locale: "en_US",
				type: "website",
			},
		};
	} catch (error) {
		console.log("Not found? ", error);
		return {
			title: "Not found",
			description: "The movie is not available or does not exist",
		};
	}
}

export default async function MovieDetails({ params: { id } }: Params) {
	const parts = id.split("-");

	const type: string = parts[0];
	const itemId: string = parts[2];

	const details: DataDetailsType = await fetchTMDBData(`${type}/${itemId}`);
	return <DetailsCard details={details} type={type as ItemType} />;
}
