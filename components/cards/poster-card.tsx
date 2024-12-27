"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import handleCopyLink from "@/lib/handleCopyLink";
import { generateLink } from "@/lib/utils";
import { addToWatchlist, isInWatchlist } from "@/lib/watchlist";
import { UserAuth } from "@/providers/auth-provider";
import type { BasicDataType } from "@/types";
import { Check, ChevronRight, MoreHorizontal, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PosterCard({ id, image, title, type }: BasicDataType) {
	const { user } = UserAuth();
	const [watched, setWatched] = useState(false);

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

	async function handleAddToWatchlist(event: React.MouseEvent<HTMLElement>) {
		event.stopPropagation();
		if (user) {
			try {
				await addToWatchlist(id, user.uid, type);
				toast.success(`Added to your watchlist.`);
				setWatched(true);
			} catch (error) {
				toast.error(`Failed to add.`);
			}
		} else {
			toast.error("You must be logged in.");
		}
	}
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		const success = handleCopyLink(event, link);
		if (success) {
			toast.success("Link copied successfully");
		} else {
			toast.error("Failed to copy link");
		}
	};

	return (
		<div className="w-[220px] md:w-[232px] lg:w-[256px] xl:w-[272px]">
			<Link href={link} scroll={true}>
				<div className="relative bg-secondary w-full aspect-[1/1.5] mb-2 shadow-sm group">
					<Image
						src={image}
						fill
						loading="lazy"
						sizes="(max-width: 1024px) 232px, 284px"
						alt={title}
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className="z-10 absolute right-3 bottom-3 w-7 h-7 bg-white opacity-80 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center">
								<MoreHorizontal
									className="text-accent w-6 h-6"
									aria-label="Options"
								/>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-48 ml-48 -mt-2 bg-background backdrop-blur-sm">
							<Link href={link}>
								<DropdownMenuItem className="space-x-4 flex justify-between">
									<div>View Details</div>
									<ChevronRight className="w-4 h-4" />
								</DropdownMenuItem>
							</Link>
							{!watched && (
								<DropdownMenuItem
									className="space-x-4 flex justify-between"
									onClick={handleAddToWatchlist}
								>
									<div>Mark as Watched</div>
									<Check className="w-4 h-4" />
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								className="space-x-4 flex justify-between"
								onClick={handleClick}
							>
								<p>Share</p>
								<Share className="w-4 h-4" />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Link>

			<p className="text-sm font-semibold whitespace-pre-line mr-1">{title}</p>
		</div>
	);
}
