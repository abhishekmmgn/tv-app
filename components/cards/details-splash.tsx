"use client";

import handleCopyLink from "@/lib/handleCopyLink";
import usePerfectImage from "@/lib/usePerfectImage";
import {
	fadeInWrapperParent,
	fadeInWrapperStat,
	generateLink,
} from "@/lib/utils";
import { addToWatchlist, isInWatchlist } from "@/lib/watchlist";
import { UserAuth } from "@/providers/auth-provider";
import type { DataDetailsType, ItemType } from "@/types";
import { motion } from "framer-motion";
import { ArrowRight, Check, Share } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export default function DetailsSplash({
	data,
	type,
}: { data: DataDetailsType; type: ItemType }) {
	const [watched, setWatched] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const { user } = UserAuth();

	const name = (data.title || data.name) as string;
	const link = generateLink(type, name, data.id);

	useEffect(() => {
		if (user) {
			isInWatchlist(data.id, user?.uid).then((result) => {
				setWatched(result);
			});
			console.log(user);
		}
	}, [user, data.id]);

	async function handleAddToWatchlist(event: React.MouseEvent<HTMLElement>) {
		event.preventDefault();
		setDisabled(true);
		if (user) {
			try {
				await addToWatchlist(data.id, user.uid, type);
				toast.success(`Added to your watchlist.`);
				setWatched(true);
			} catch (error) {
				console.log(error);
				toast.error(`Failed to add.`);
			}
		} else {
			toast.error("You must be logged in.");
		}
		setDisabled(false);
	}

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setDisabled(true);
		const success = handleCopyLink(event, link);
		if (success) {
			toast.success("Link copied successfully");
		} else {
			toast.error("Failed to copy link");
		}
		setDisabled(false);
	};
	return (
		<motion.div
			variants={fadeInWrapperParent}
			initial="hidden"
			animate="show"
			className="w-full relative aspect-[9/16] max-h-[90vh] sm:aspect-video sm:max-h-max bg-secondary"
		>
			<motion.div variants={fadeInWrapperStat}>
				<Image
					src={usePerfectImage(data?.poster_path, data?.backdrop_path)}
					alt={`Poster of ${data?.title}`}
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				<div className="z-10 absolute bottom-0 inset-x-0 h-[70%] bg-gradient-to-b from-black/0 to-black flex flex-col justify-end items-center sm:items-start px-5 sm:px-8 xl:px-12 pb-6 sm:pb-10">
					<h1 className="font-bold text-2xl md:text-3xl w-[90%] lg:w-3/4 text-center sm:text-left line-clamp-2">
						{name}
					</h1>
					<p className="text-neutral-300 mb-4 w-3/4 lg:w-1/2 text-center sm:text-left line-clamp-2">
						{data.tagline || data.overview}
					</p>
					<div className="space-y-2">
						{data.homepage && (
							<Button size="lg" className="w-64 flex gap-2" asChild>
								<a href={data.homepage} target="_blank" rel="noreferrer">
									Watch
									<ArrowRight className="w-4 h-4 -rotate-45" />
								</a>
							</Button>
						)}
						{!watched && (
							<Button
								size="lg"
								className="w-64 flex gap-2"
								disabled={disabled}
								onClick={handleAddToWatchlist}
							>
								Mark as Watched
								<Check className="w-4 h-4" />
							</Button>
						)}
						<Button size="lg" className="w-64 flex gap-2" onClick={handleClick}>
							Share
							<Share className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
