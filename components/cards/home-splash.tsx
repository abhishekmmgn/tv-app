"use client";

import usePerfectImage from "@/lib/usePerfectImage";
import {
	fadeInWrapperParent,
	fadeInWrapperStat,
	generateLink,
} from "@/lib/utils";
import type { DataListType } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function HomeSplash({ data }: { data: DataListType }) {
	let parent = {
		show: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	};
	let stat = {
		hidden: { opacity: 0 },
		show: { opacity: 1 },
	};
	const name = data?.name || data?.title;
	const link = generateLink(data.media_type, name as string, data.id);
	return (
		<motion.div
			variants={fadeInWrapperParent}
			initial="hidden"
			animate="show"
			className="relative w-full inset-x-0 aspect-[9/16] max-h-[90vh] sm:aspect-video sm:max-h-[110vh] bg-secondary"
		>
			<motion.div variants={fadeInWrapperStat}>
				<Image
					src={usePerfectImage(data?.poster_path, data?.backdrop_path)}
					alt={`Poster of ${name}`}
					fill
					loading="eager"
					sizes="100vw"
					priority
					className="object-cover"
				/>
			</motion.div>
			<div className="z-10 absolute bottom-0 inset-x-0 h-[50%] bg-gradient-to-b from-transparent to-black flex flex-col justify-end items-center sm:items-start px-5 sm:px-8 xl:px-12 pb-6 sm:pb-10">
				<h1 className="font-bold text-2xl md:text-3xl w-[90%] lg:w-3/4 text-center sm:text-left line-clamp-1">
					{name}
				</h1>
				<p className="text-neutral-300 mb-4 w-3/4 lg:w-1/2 text-center sm:text-left line-clamp-1 sm:mt-1 sm:line-clamp-2">
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
