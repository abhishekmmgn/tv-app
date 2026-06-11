"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import handleShare from "@/lib/handleShare";
import { generateLink } from "@/lib/utils";
import {
	addToWatchlist,
	isInWatchlist,
	removeFromWatchlist,
} from "@/lib/watchlist";
import { UserAuth } from "@/providers/auth-provider";
import type { BasicDataType } from "@/types";
import {
	IoCheckmark,
	IoChevronForward,
	IoEllipsisHorizontal,
	IoShareOutline,
} from "react-icons/io5";
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
}: BasicDataType & { className?: string }) {
	const { user } = UserAuth();
	const [watched, setWatched] = useState(false);
	const [optimisticWatched, setOptimisticWatched] = useOptimistic(
		watched,
		(state, newWatched: boolean) => newWatched,
	);
	const [isPending, startTransition] = useTransition();

	const link = generateLink(type, title, id);

	useEffect(() => {
		const checkWatchlist = async () => {
			if (user) {
				const result = await isInWatchlist(id, user.uid);
				setWatched(result);
			}
		};
		checkWatchlist();
	}, [user, id]);

	const handleToggleWatchlist = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		event.preventDefault();
		if (!user) {
			toast.error("You must be logged in.");
			return;
		}

		const nextWatched = !watched;
		startTransition(async () => {
			setOptimisticWatched(nextWatched);
			try {
				if (nextWatched) {
					await addToWatchlist(id, user.uid, type);
					toast.success(`Added to your watchlist.`);
				} else {
					await removeFromWatchlist(id, user.uid, type);
					toast.success(`Removed from your watchlist.`);
				}
				setWatched(nextWatched);
			} catch (error) {
				toast.error("Failed to update watchlist.");
			}
		});
	};

	const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		event.preventDefault();
		const { copied } = await handleShare(event, link, title);
		if (copied) {
			toast.success("Link copied successfully");
		}
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
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
									}}
									className="z-10 absolute right-3 bottom-3 w-7 h-7 bg-white opacity-80 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center cursor-pointer outline-none"
								>
									<IoEllipsisHorizontal
										className="text-blue-500 w-6 h-6"
										aria-label="Options"
									/>
								</button>
							}
						/>
						<DropdownMenuContent
							align="end"
							className="w-56 bg-background backdrop-blur-sm"
						>
							<DropdownMenuItem
								className="space-x-4 flex justify-between"
								onClick={handleToggleWatchlist}
								disabled={isPending}
							>
								<div>
									{optimisticWatched ? "Mark as Unwatched" : "Mark as Watched"}
								</div>
								{optimisticWatched ? (
									<IoCheckmark className="w-4 h-4 text-emerald-500" />
								) : (
									<IoCheckmark className="w-4 h-4" />
								)}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="space-x-4 flex justify-between"
								onClick={handleClick}
							>
								<p>Share</p>
								<IoShareOutline className="w-4 h-4" />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Link>

			<p className="text-sm font-semibold whitespace-pre-line mr-1">{title}</p>
		</div>
	);
}
