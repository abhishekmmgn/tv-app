import type { ItemType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateLink(type: ItemType, name: string, id: number): string {
	return `/${type}-${name.replace(/[^a-zA-Z0-9]/g, "")}-${id}`;
}
