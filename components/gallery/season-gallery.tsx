import { galleryType } from "@/types";
import SeasonCard from "../cards/season-card";

export default function SeasonCardGallery(props: galleryType) {
	return (
		<>
			{props.data?.episodes.map((episode: any, index: number) => (
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
