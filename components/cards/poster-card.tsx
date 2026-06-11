"use client";

import handleShare from "@/lib/handleShare";
import { generateLink } from "@/lib/utils";
import { UserAuth } from "@/providers/auth-provider";
import type { BasicDataType } from "@/types";
import { IoCheckmark, IoClose, IoShareOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";

export default function PosterCard({
	id,
	image,
	title,
	type,
	className,
	onToggle,
}: BasicDataType & {
	className?: string;
	onToggle?: (id: number, watched: boolean) => void;
}) {
	const { user, isInWatchlist, addToWatchlist, removeFromWatchlist } =
		UserAuth();
	const [optimisticWatched, setOptimisticWatched] = useOptimistic(
		isInWatchlist(id),
		(state, newWatched: boolean) => newWatched,
	);
	const [isPending, startTransition] = useTransition();

	const link = generateLink(type, title, id);

	const handleToggleWatchlist = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		event.preventDefault();
		if (!user) {
			toast.error("You must be logged in.");
			return;
		}

		const nextWatched = !optimisticWatched;
		startTransition(async () => {
			setOptimisticWatched(nextWatched);
			try {
				if (nextWatched) {
					await addToWatchlist(id, type as "movie" | "tv");
					toast.success(`Added to your watchlist.`);
				} else {
					await removeFromWatchlist(id);
					toast.success(`Removed from your watchlist.`);
				}
				if (onToggle) onToggle(id, nextWatched);
			} catch (error) {
				toast.error("Failed to update watchlist.");
			}
		});
	};

	const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		event.preventDefault();
		const { copied } = await handleShare(event, link, title);
		if (copied) toast.success("Link copied successfully");
	};

	return (
		<div className={className ?? "w-55 md:w-58 lg:w-[256px] xl:w-68"}>
			<Link href={link} scroll={true}>
				<div className="relative bg-secondary w-full aspect-1/1.5 mb-2 shadow-sm group">
					<Image
						src={image}
						fill
						loading="lazy"
						sizes="(max-width: 1024px) 232px, 284px"
						alt={title}
						className="hover:brightness-90"
					/>
					<div className="z-10 absolute right-3 bottom-3 flex gap-2">
						<button
							type="button"
							disabled={isPending}
							onClick={handleToggleWatchlist}
							className="w-7 h-7 bg-white opacity-80 hover:opacity-100 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center cursor-pointer outline-none transition-all duration-200 active:scale-95 disabled:opacity-50"
						>
							{optimisticWatched ? (
								<IoClose
									className="text-rose-500 w-4 h-4"
									aria-label="Mark as Unwatched"
								/>
							) : (
								<IoCheckmark
									className="text-emerald-500 w-4 h-4"
									aria-label="Mark as Watched"
								/>
							)}
						</button>
						<button
							type="button"
							onClick={handleClick}
							className="w-7 h-7 bg-white opacity-80 hover:opacity-100 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center cursor-pointer outline-none transition-all duration-200 active:scale-95"
						>
							<IoShareOutline
								className="text-blue-500 w-4 h-4"
								aria-label="Share"
							/>
						</button>
					</div>
				</div>
			</Link>

			<p className="text-sm font-semibold whitespace-pre-line mr-1">{title}</p>
		</div>
	);
}
