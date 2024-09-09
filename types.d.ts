import { StaticImageData } from "next/image";

export type galleryType = {
  data: any;
};

export type itemType = {
  id: number;
  image: string | StaticImageData; 
  title: string;
  isAShow: boolean;
};

export type ItemType =
  | "video"
  | "category"
  | "credits"
  | "poster"
  | "season"
  | "search-results";
