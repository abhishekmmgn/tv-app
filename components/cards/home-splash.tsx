"use client";

import { getSplashImageUrl } from "@/lib/usePerfectImage";
import { generateLink } from "@/lib/utils";
import type { DataListType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function HomeSplash({ data }: { data: DataListType }) {
	const name = data?.name || data?.title;
	const link = generateLink(data.media_type, name as string, data.id);
	const imageUrl = getSplashImageUrl(data?.backdrop_path, data?.poster_path);
	return (
		<div className="relative w-full inset-x-0 aspect-[9/16] max-h-[90vh] sm:aspect-video sm:max-h-[110vh] bg-secondary animate-fade-in-stagger">
			<div className="animate-fade-in">
				<Image
					src={imageUrl}
					alt={`Poster of ${name}`}
					fill
					loading="eager"
					sizes="100vw"
					priority
					className="object-cover"
				/>
			</div>
			<div className="z-10 absolute bottom-0 inset-x-0 h-[50%] bg-gradient-to-b from-transparent to-black flex flex-col justify-end items-center sm:items-start horizontal-padding pb-6 sm:pb-10">
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
		</div>
	);
}
