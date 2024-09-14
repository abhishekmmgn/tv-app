"use client";

import { Button } from "@/components/ui/button";
import usePerfectImage from "@/lib/usePerfectImage";
import {
	fadeInWrapperParent,
	fadeInWrapperStat,
	generateLink,
} from "@/lib/utils";
import type { ItemType } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function PersonalizedCard({ data }: { data: any }) {
	const item: ItemType = data?.first_air_date || data?.name ? "tv" : "movie";
	const name = data?.name || data?.title;
	const link = generateLink(item, name, data.id);
	return (
		<motion.div
			variants={fadeInWrapperParent}
			initial="hidden"
			animate="show"
			className="relative w-full aspect-[9/16] max-h-[90vh] sm:aspect-video bg-secondary rounded-md"
		>
			<motion.div variants={fadeInWrapperStat}>
				<Image
					src={usePerfectImage(data?.poster_path, data?.backdrop_path)}
					alt={`Poster of ${name}`}
					fill
					sizes="100vw"
					className="object-cover rounded-md"
				/>
			</motion.div>
			<div className="z-10 absolute bottom-0 inset-x-0 h-[75%] bg-gradient-to-b from-transparent to-black flex flex-col justify-end items-center px-5 sm:px-8 xl:px-12 pb-6 sm:pb-10 rounded-b-md">
				<h1 className="font-bold text-2xl md:text-3xl w-[90%] lg:w-3/4 text-center line-clamp-1">
					{data?.name || data?.title}
				</h1>
				<p className="text-neutral-300 mb-4 w-3/4 lg:w-1/2 text-center line-clamp-1 sm:line-clamp-2">
					{data?.tagline || data?.overview}
				</p>
				<Link href={link}>
					<Button size="lg" className="w-48">
						Watch
					</Button>
				</Link>
			</div>
		</motion.div>
	);
}
