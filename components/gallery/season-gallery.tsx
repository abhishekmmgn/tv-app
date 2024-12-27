import { GalleryType } from "@/types";
import SeasonCard from "../cards/season-card";

export default function SeasonCardGallery({ data }: { data: GalleryType[] }) {
	return (
		<>
			{data.map((episode: any, index: number) => (
				<div key={index}>
					<SeasonCard
						image={episode.still_path}
						name={episode.name}
						overview={episode.overview}
						episode_number={episode.episode_number}
						runtime={episode.runtime}
					/>
				</div>
			))}
		</>
	);
}
