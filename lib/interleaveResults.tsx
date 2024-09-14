import { BasicDataType } from "@/types";

export default function interleaveResults(movies: any[], shows: any[]): any[] {
	const interleaved: BasicDataType[] = [];
	const maxLength = Math.max(movies.length, shows.length);

	for (let i = 0; i < maxLength; i++) {
		if (i < movies.length) {
			interleaved.push({
				id: movies[i].id,
				title: movies[i].title,
				image: movies[i]?.poster_path || movies[i]?.backdrop_path,
				type: "movie",
			});
		}

		if (i < shows.length) {
			interleaved.push({
				id: shows[i].id,
				title: shows[i].name,
				image: movies[i]?.poster_path || movies[i]?.backdrop_path,
				type: "tv",
			});
		}
	}
	return interleaved;
}
