export type galleryType = {
  data: any;
};

export type itemType = {
  id: number;
  image: string;
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
