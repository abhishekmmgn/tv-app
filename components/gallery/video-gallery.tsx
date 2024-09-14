import { galleryType } from "@/types";
import VideoCard from "../cards/video-card";

export default function VideoCardGallery(props: galleryType) {
	let data = [];
	if (props.data?.results) {
		data = [...props.data.results].reverse();
	}
	return (
		<>
			{data.slice(0, 5).map((item: any, index: number) => (
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
