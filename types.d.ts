import { StaticImageData } from "next/image";

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
	type: ItemType;
	poster_path?: string;
	backdrop_path?: string;
}[];

export type CardType =
	| "video"
	| "category"
	| "credits"
	| "poster"
	| "season"
	| "search-results";

export type ItemType = "movie" | "tv";

export type DetailsType = {
	name?: string;
	title?: string;
	backdrop_path?: string;
	poster_path?: string;
	tagline?: string;
	overview?: string;
	number_of_seasons?: number;
	id: string;
};

export type CategoryCardType = {
	title: string;
	link: string;
	from: string;
	to: string;
	isGallery?: boolean;
};
