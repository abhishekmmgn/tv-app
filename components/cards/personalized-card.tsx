"use client";

import { Button } from "@/components/ui/button";
import { SplashImage } from "@/lib/usePerfectImage";
import { generateLink } from "@/lib/utils";
import type { DataListType } from "@/types";
import Link from "next/link";

export default function PersonalizedCard({ data }: { data: DataListType }) {
	const name = data?.name || data?.title;
	const link = generateLink(data.media_type, name as string, data.id);
	return (
		<div className="relative w-full aspect-9/16 max-h-[90vh] sm:aspect-video bg-secondary rounded-md animate-fade-in-stagger">
			<div className="animate-fade-in">
				<SplashImage
					backdrop_path={data?.backdrop_path}
					poster_path={data?.poster_path}
					alt={`Poster of ${name}`}
					className="absolute inset-0 h-full w-full object-cover rounded-md"
				/>
			</div>
			<div className="z-10 absolute bottom-0 inset-x-0 h-[75%] bg-linear-to-b from-transparent to-black flex flex-col justify-end items-center horizontal-padding pb-6 sm:pb-10 rounded-b-md">
				<h1 className="font-bold text-2xl md:text-3xl w-[90%] lg:w-3/4 text-center line-clamp-1">
					{data?.name || data?.title}
				</h1>
				<p className="text-neutral-300 mb-4 w-3/4 lg:w-1/2 text-center line-clamp-1 sm:line-clamp-2">
					{data?.tagline || data?.overview}
				</p>
				<Link href={link}>
					<Button size="lg" className="w-48">
						Details
					</Button>
				</Link>
			</div>
		</div>
	);
}
