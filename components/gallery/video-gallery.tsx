import { GalleryType } from "@/types";
import VideoCard from "../cards/video-card";

export default function VideoCardGallery({ data }: { data: GalleryType[] }) {
	return (
		<>
			{data.slice(0, 10).map((item: any, index: number) => (
				<div key={index}>
					<VideoCard
						title={item.name}
						link={`https://www.youtube.com/embed/${item.key}`}
					/>
				</div>
			))}
		</>
	);
}
