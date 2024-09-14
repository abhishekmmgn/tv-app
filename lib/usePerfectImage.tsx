"use client";

import { useWindowSize } from "usehooks-ts";

export default function usePerfectImage(
	poster_path?: string,
	backdrop_path?: string,
) {
	const { width = 0, height = 0 } = useWindowSize({
		initializeWithValue: false,
	});

	let img: string = "";

	const hqBackdropPath = `https://image.tmdb.org/t/p/300${backdrop_path}`;
	const originalPosterPath = `https://image.tmdb.org/t/p/original${poster_path}`;

	if (width) {
		if (width < 92) {
			img = poster_path
				? `https://image.tmdb.org/t/p/w92${poster_path}`
				: hqBackdropPath;
		} else if (width < 154) {
			img = poster_path
				? `https://image.tmdb.org/t/p/w154${poster_path}`
				: hqBackdropPath;
		} else if (width < 185) {
			img = poster_path
				? `https://image.tmdb.org/t/p/w185${poster_path}`
				: hqBackdropPath;
		} else if (width < 342) {
			img = poster_path
				? `https://image.tmdb.org/t/p/w342${poster_path}`
				: hqBackdropPath;
		} else if (width < 500) {
			img = poster_path
				? `https://image.tmdb.org/t/p/w500${poster_path}`
				: hqBackdropPath;
		} else if (width < 648) {
			img = poster_path
				? `https://image.tmdb.org/t/p/w780${poster_path}`
				: hqBackdropPath;
		} else if (width < 1280) {
			img = backdrop_path
				? `https://image.tmdb.org/t/p/w1280${backdrop_path}`
				: originalPosterPath;
		} else {
			img = backdrop_path
				? `https://image.tmdb.org/t/p/original${backdrop_path}`
				: originalPosterPath;
		}
	} else {
		return hqBackdropPath;
	}
	return img;
}
