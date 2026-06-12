import { CardType } from "@/types";
import { IoChevronForward } from "react-icons/io5";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export function PosterCardSkeleton({ className }: { className?: string }) {
	return (
		<div className={className ?? "w-55 md:w-58 lg:w-[256px] xl:w-68"}>
			<Skeleton className="w-full aspect-[1/1.5] mb-2 shadow-sm rounded-none" />
			<Skeleton className="w-24 h-4" />
		</div>
	);
}

export function VideoCardSkeleton({ className }: { className?: string }) {
	return (
		<div className={className ?? "w-[360px] md:w-[372px] xl:w-[384px]"}>
			<Skeleton className="w-full aspect-video mb-2 shadow-sm rounded-md" />
			<Skeleton className="w-24 h-4" />
		</div>
	);
}

export function SeasonCardSkeleton({ className }: { className?: string }) {
	return (
		<div className={className ?? "w-[332px] md:w-[348px] xl:w-[356px]"}>
			<Skeleton className="w-full aspect-video mb-2 shadow-sm rounded-md" />
			<div className="w-full flex flex-col gap-1">
				<Skeleton className="w-24 h-4" />
				<Skeleton className="w-full h-3" />
				<Skeleton className="w-2/3 h-3" />
			</div>
		</div>
	);
}

export function CreditsCardSkeleton({ className }: { className?: string }) {
	return (
		<div className={className ?? "flex flex-col items-center"}>
			<Skeleton className="w-24 md:w-28 xl:w-32 h-24 md:h-28 xl:h-32 aspect-square rounded-full shadow-sm" />
			<div className="mt-2 w-24 md:w-28 xl:w-32 flex flex-col items-center gap-1">
				<Skeleton className="w-20 h-4" />
				<Skeleton className="w-16 h-3" />
			</div>
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
		<div className="w-full aspect-[9/16] max-h-[90vh] sm:aspect-video sm:max-h-max bg-secondary grid items-end justify-center sm:justify-start horizontal-padding pb-6 sm:pb-10">
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
				<Skeleton className="w-20 aspect-video rounded-md border-2 border-transparent" />
				<div>
					<Skeleton className="w-24 h-3" />
					<Skeleton className="mt-1 w-8 h-3" />
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
		<div className="relative horizontal-padding group">
			<h1 className="font-semibold text-lg mb-3 text-neutral-200 capitalize">
				<span>{title}</span>
				<IoChevronForward className="w-4 h-4 inline" />
			</h1>
			<div>
				<div className="flex gap-5 overflow-x-auto whitespace-nowrap no-scrollbar">
					{loadingArray.map((item) => {
						if (type === "video") {
							return (
								<div key={item}>
									<VideoCardSkeleton />
								</div>
							);
						} else if (type === "category") {
							return (
								<div key={item}>
									<PosterCardSkeleton />
								</div>
							);
						} else if (type === "credits") {
							return (
								<div key={item}>
									<CreditsCardSkeleton />
								</div>
							);
						} else if (type === "poster") {
							return (
								<div key={item}>
									<PosterCardSkeleton />
								</div>
							);
						} else if (type === "season") {
							return (
								<div key={item}>
									<SeasonCardSkeleton />
								</div>
							);
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
