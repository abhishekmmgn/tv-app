import noItem from "@/public/no-item.png";
import PosterCard from "../cards/poster-card";
import { DataListType } from "@/types";

function perfectImage(posterPath: string, backdropPath: string) {
	if (posterPath) {
		return `https://image.tmdb.org/t/p/w342${posterPath}`;
	} else if (backdropPath) {
		return `https://image.tmdb.org/t/p/w300${backdropPath}`;
	} else {
		return noItem;
	}
}
export default function PosterCardGallery({ data }: { data: DataListType[] }) {
	return (
		<>
			{data.map((item: any, index: number) => (
				<div key={index}>
					<PosterCard
						image={perfectImage(item.poster_path, item.backdrop_path)}
						id={item.id}
						title={item.title || item.name}
						type={item.first_air_date || item.name ? "tv" : "movie"}
					/>
				</div>
			))}
		</>
	);
}
