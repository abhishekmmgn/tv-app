import { CardType } from "@/types";
import { ChevronRight } from "lucide-react";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export function PosterCardSkeleton() {
	return (
		<div className="shadow-sm space-y-2">
			<Skeleton className="w-[220px] md:w-[232px] lg:w-[256px] xl:w-[272px] aspect-[1/1.5] rounded-none" />
			<Skeleton className="w-14 h-3" />
		</div>
	);
}

export function VideoCardSkeleton() {
	return (
		<div className="shadow-sm space-y-2">
			<Skeleton className="w-[360px] md:w-[372px] xl:w-[384px] aspect-video rounded-md" />
			<Skeleton className="w-14 h-3" />
		</div>
	);
}

export function SeasonCardSkeleton() {
	return (
		<div className="shadow-sm space-y-2">
			<Skeleton className="w-[332px] md:w-[348px] xl:w-[356px] aspect-video rounded-md" />
			<Skeleton className="w-14 h-3" />
		</div>
	);
}

export function CreditsCardSkeleton() {
	return (
		<div className="flex flex-col items-center shadow-sm space-y-2">
			<Skeleton className="w-24 md:w-28 xl:w-32 h-24 md:h-28 xl:h-32 aspect-square rounded-full" />
			<Skeleton className="w-16 h-3" />
		</div>
	);
}

export function SuggestionsCardSkeleton() {
	return (
		<div className="aspect-video shadow-sm">
			<Skeleton className="w-full h-full rounded-xl" />
		</div>
	);
}

export function DetailsSplashSkeleton() {
	return (
		<div className="w-full aspect-[9/16] max-h-[90vh] sm:aspect-video sm:max-h-max bg-secondary grid items-end justify-center sm:justify-start px-5 sm:px-8 xl:px-12 pb-6 sm:pb-10">
			<div className="flex flex-col gap-1 justify-center items-center sm:items-start w-[332px]">
				<Skeleton className="w-32 h-5" />
				<Skeleton className="mt-1 w-80 h-4" />
				<Skeleton className="mb-4 w-80 h-4" />
				<Skeleton className="w-64 h-10" />
				<Skeleton className="mt-2 w-64 h-10" />
			</div>
		</div>
	);
}

export function SearchSuggestionsCardSkeleton() {
	return (
		<div className="h-16 w-full bg-background">
			<div className="flex gap-2 p-2 items-center justify-start">
				<Skeleton className="w-20 aspect-video" />
				<div>
					<Skeleton className="w-16 h-3" />
					<Skeleton className="mt-1 w-6 h-3" />
				</div>
			</div>
			<Separator />
		</div>
	);
}

export function CardGallerySkeleton({
	title,
	type,
}: {
	title: string;
	type: CardType;
}) {
	const loadingArray = Array.from({ length: 10 }, (_, i) => i + 1);
	return (
		<div className="relative px-5 md:px-8 xl:px-12 group">
			<h1 className="font-semibold text-lg mb-3 text-neutral-200 capitalize">
				<span>{title}</span>
				<ChevronRight className="w-4 h-4 inline" />
			</h1>
			<div>
				<div className="flex gap-5 overflow-x-auto whitespace-nowrap no-scrollbar">
					{loadingArray.map((item) => {
						if (type === "video") {
							return <VideoCardSkeleton key={item} />;
						} else if (type === "category") {
							return <PosterCardSkeleton key={item} />;
						} else if (type === "credits") {
							return <CreditsCardSkeleton key={item} />;
						} else if (type === "poster" || type === "search-results") {
							return <PosterCardSkeleton key={item} />;
						} else if (type === "season") {
							return <SeasonCardSkeleton key={item} />;
						}
					})}
				</div>
				<div className="mt-5">
					<Separator />
				</div>
			</div>
		</div>
	);
}
