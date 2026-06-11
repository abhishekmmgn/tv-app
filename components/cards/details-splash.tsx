"use client";

import handleShare from "@/lib/handleShare";
import { getSplashImageUrl } from "@/lib/usePerfectImage";
import {
	fadeInWrapperParent,
	fadeInWrapperStat,
	generateLink,
} from "@/lib/utils";
import {
	addToWatchlist,
	isInWatchlist,
	removeFromWatchlist,
} from "@/lib/watchlist";
import { UserAuth } from "@/providers/auth-provider";
import type { DataDetailsType, ItemType } from "@/types";
import { motion } from "framer-motion";
import { IoArrowForward, IoCheckmark, IoShareOutline } from "react-icons/io5";
import Image from "next/image";
import { useEffect, useState, useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export default function DetailsSplash({
	data,
	type,
}: {
	data: DataDetailsType;
	type: ItemType;
}) {
	const [watched, setWatched] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [optimisticWatched, setOptimisticWatched] = useOptimistic(
		watched,
		(state, newWatched: boolean) => newWatched,
	);
	const [isPending, startTransition] = useTransition();
	const { user } = UserAuth();

	const name = (data.title || data.name) as string;
	const link = generateLink(type, name, data.id);
	const imageUrl = getSplashImageUrl(data?.backdrop_path, data?.poster_path);

	useEffect(() => {
		if (user) {
			isInWatchlist(data.id, user?.uid).then((result) => {
				setWatched(result);
			});
			console.log(user);
		}
	}, [user, data.id]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [data.id]);

	const handleToggleWatchlist = (event: React.MouseEvent<HTMLElement>) => {
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
					await addToWatchlist(data.id, user.uid, type);
					toast.success(`Added to your watchlist.`);
				} else {
					await removeFromWatchlist(data.id, user.uid, type);
					toast.success(`Removed from your watchlist.`);
				}
				setWatched(nextWatched);
			} catch (error) {
				console.log(error);
				toast.error("Failed to update watchlist.");
			}
		});
	};

	const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
		setDisabled(true);
		const { copied } = await handleShare(event, link, name);
		if (copied) toast.success("Link copied successfully");
		setDisabled(false);
	};
	return (
		<motion.div
			variants={fadeInWrapperParent}
			initial="hidden"
			animate="show"
			className="w-full relative aspect-9/16 max-h-[90vh] sm:aspect-video sm:max-h-max bg-secondary"
		>
			<motion.div variants={fadeInWrapperStat}>
				<Image
					src={imageUrl}
					alt={`Poster of ${data?.title}`}
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				<div className="z-10 absolute bottom-0 inset-x-0 h-[70%] bg-linear-to-b from-black/0 to-black flex flex-col justify-end items-center sm:items-start horizontal-padding pb-6 sm:pb-10">
					<h1 className="font-bold text-2xl md:text-3xl w-[90%] lg:w-3/4 text-center sm:text-left line-clamp-2">
						{name}
					</h1>
					<p className="text-neutral-300 mb-4 w-3/4 lg:w-1/2 text-center sm:text-left line-clamp-2">
						{data.tagline || data.overview}
					</p>
					<div className="space-y-2">
						{data.homepage && (
							<Button
								size="lg"
								className="w-64 flex gap-2"
								nativeButton={false}
								render={
									<a href={data.homepage} target="_blank" rel="noreferrer" />
								}
							>
								Watch
								<IoArrowForward className="w-4 h-4 -rotate-45" />
							</Button>
						)}
						<Button
							size="lg"
							variant={optimisticWatched ? "outline" : "default"}
							className="w-64 flex gap-2"
							disabled={isPending}
							onClick={handleToggleWatchlist}
						>
							{optimisticWatched ? "Mark as Unwatched" : "Mark as Watched"}
						</Button>
						<Button size="lg" className="w-64 flex gap-2" onClick={handleClick}>
							Share
							<IoShareOutline className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
