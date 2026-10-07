import { StaticImageData } from "next/image";
import type { TmdbDetails, TmdbItem } from "@/lib/effect/schemas";

export type BasicDataType = {
	id: number;
	image: string | StaticImageData;
	title: string;
	type: ItemType;
};

export type GalleryType = {
	id: number;
	name?: string;
	title?: string;
	type: string;
	official: boolean;
	poster_path?: string;
	backdrop_path?: string;
};

export type CardType = "video" | "category" | "credits" | "poster" | "season";

export type ItemType = "movie" | "tv";

export type SeasonCardType = {};

export type CastProfileType = {
	name: string;
	profile_path?: null | string;
	character?: string;
	job?: string;
};
export type CreditsListType = {
	cast: CastProfileType[];
	crew: CastProfileType[];
};

export type CategoryCardType = {
	title: string;
	link: string;
	from: string;
	to: string;
	isGallery?: boolean;
};




export type DataListType = TmdbItem;
export type DataDetailsType = TmdbDetails;
