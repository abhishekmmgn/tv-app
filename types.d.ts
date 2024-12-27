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

type CollectionType = {
	id: string;
	name: string;
	poster_path: string;
	backdrop_path: string;
};

type GenreType = {
	id: number;
	name: string;
};
type ProductionCompaniesType = {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
};
type ProductionCountriesType = {
	iso_3166_1: string;
	name: string;
};

type NetworkType = {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
};

export interface DataListType {
	id: number;
	original_title: string;
	tagline?: string;
	poster_path?: string;
	backdrop_path?: string;
	overview?: string;
	media_type: ItemType;
	adult: boolean;
	original_language: string;
	genre_ids: number[];
	popularity: number;
	release_date: string;
	video: boolean;
	origin_country?: string[];
	runtime?: number;
	name?: string;
	title?: string;
}
export interface DataDetailsType extends DataListType {
	genres: object[];
	belongs_to_collection: CollectionType;
	networks?: NetworkType[];
	budget?: number;
	genres?: GenreType[];
	production_companies?: ProductionCompaniesType[];
	revenue?: number;
	status: string;
	homepage?: string;
	languages?: string[];
	first_air_date: string;
	episodes: number;
	number_of_seasons: number;
	status: string;
	episode_run_time: number[];
	networks: NetworkType[];
	number_of_episodes: number;
	number_of_seasons: number;
	original_language: string;
	original_name: string;
	seasons: object[];
	status: string;
}
