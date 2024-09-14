import { generateLink } from "@/lib/utils";
import type { CategoryCardType, ItemType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import noItemLandscape from "../../public/noItemLandscape.png";

export function CategoryCard(props: CategoryCardType) {
	return (
		<Link href={`/search?category=${props.link}`}>
			<div
				className={`relative bg-secondary aspect-video shadow-sm rounded-xl ${
					props.isGallery
						? "w-[228px] md:w-[240px] lg:w-[264px] xl:w-[280px]"
						: "max-w-sm"
				}}`}
				style={{
					background: `linear-gradient(to right, ${props.from}, ${props.to})`,
				}}
			>
				<h1 className="absolute bottom-3 left-3 z-10 text-xl font-bold opacity-80 xl:text-2xl backdrop-blur-sm line-clamp-2 md:line-clamp-3 leading-tight">
					{props.title}
				</h1>
			</div>
		</Link>
	);
}

type suggestionProps = {
	id: number;
	title: string;
	image: string;
	type: ItemType;
};

export function SuggestionCard(props: suggestionProps) {
	const link = generateLink(props.type, props.title, props.id);

	return (
		<Link href={link}>
			<div className="relative w-full aspect-video shadow-sm rounded-xl bg-secondary">
				<div className="absolute z-10 bottom-0 inset-x-0 h-full w-full grid items-end rounded-b-xl bg-gradient-to-b from-transparent to-black">
					<h1 className="px-3 pb-3 text-xl font-bold opacity-80 leading-none xl:text-2xl line-clamp-2 md:line-clamp-3">
						{props.title}
					</h1>
				</div>
				<Image
					src={
						props.image
							? `https://image.tmdb.org/t/p/w342${props.image}`
							: noItemLandscape
					}
					alt={props.title}
					fill
					sizes="256px"
					className="rounded-xl"
				/>
			</div>
		</Link>
	);
}
