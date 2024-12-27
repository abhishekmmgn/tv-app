import { Separator } from "@/components/ui/separator";
import { fetchTMDBData } from "@/lib/requests";
import type { CardType, DataListType, GalleryType } from "@/types";
import { ChevronRight } from "lucide-react";
import CategoriesGallery from "./categories-gallery";
import CreditsGallery from "./credits-gallery";
import PosterCardGallery from "./posters-gallery";
import SeasonCardGallery from "./season-gallery";
import VideoCardGallery from "./video-gallery";

export const dynamic = "force-dynamic";

export default function CardGallery({
	title,
	data,
	type,
}: {
	title: string;
	data: any;
	type: CardType;
}) {
	return (
		<div className="relative px-5 md:px-8 xl:px-12 group">
			{title && (
				<h1 className="font-semibold text-lg mb-3 text-neutral-200 capitalize">
					<span>{title}</span>
					<ChevronRight className="w-4 h-4 inline" />
				</h1>
			)}
			<div>
				{data && (
					<div className="flex gap-5 overflow-x-auto whitespace-nowrap no-scrollbar">
						{(() => {
							switch (type) {
								case "video":
									return (
										<VideoCardGallery data={data.results as GalleryType[]} />
									);
								case "poster":
									return (
										<PosterCardGallery data={data.results as DataListType[]} />
									);
								case "credits":
									return <CreditsGallery data={data} />;
								case "category":
									return <CategoriesGallery />;
								case "season":
									return <SeasonCardGallery data={data} />;
								default:
									return <></>;
							}
						})()}
					</div>
				)}
				<div className="mt-5">
					<Separator />
				</div>
			</div>
		</div>
	);
}

export async function CardGalleryWrapper({
	title,
	url,
	type,
}: {
	title: string;
	url: string;
	type: CardType;
}) {
	if (type === "category") {
		return <CardGallery data={[]} title={title} type={type} />;
	}
	const data = await fetchTMDBData(url);
	return <CardGallery data={data} title={title} type={type} />;
}
