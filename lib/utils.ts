import type { ItemType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Trending results carry `media_type`; movie/tv-specific endpoints do not, but
// TV items always have `name` while movies have `title`.
export function mediaTypeOf(item: { media_type?: ItemType; name?: string }): ItemType {
	return item.media_type ?? (item.name ? "tv" : "movie");
}

export function generateLink(type: ItemType, name: string, id: number): string {
	return `/${type}-${name.replace(/[^a-zA-Z0-9]/g, "")}-${id}`;
}
