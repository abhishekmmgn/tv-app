import axios, { AxiosError } from "axios";

const requests = {
	fetchTrendingToday: `/trending/all/day`,
	fetchTrendingWeekly: `/trending/all/week`,
	fetchPopular: `/movie/popular`,
	fetchTopRated: `/movie/top_rated`,
	fetchUpcoming: `/movie/upcoming`,
	fetchNowPlaying: `/movie/now_playing`,

	fetchActionMovies: `/discover/movie?&with_genres=28`,
	fetchComedyMovies: `/discover/movie?&with_genres=35`,
	fetchHorrorMovies: `/discover/movie?&with_genres=27`,
	fetchRomanceMovies: `/discover/movie?&with_genres=10749`,
	fetchDocumentaries: `/discover/movie?&with_genres=99`,
	fetchDrama: `/discover/movie?&with_genres=18`,
	fetchFamily: `/discover/movie?&with_genres=10751`,
	fetchThriller: `/discover/movie?&with_genres=53`,
	fetchAdventure: `/discover/movie?&with_genres=12`,
	fetchAnimation: `/discover/movie?&with_genres=16`,
	fetchNonFiction: `/discover/movie?&with_genres=10770`,

	fetchNetflix: `/discover/tv?with_networks=213`,
	fetchAppleTV: `/discover/tv?&with_networks=2552`,
	fetchPrimeVideo: `/discover/tv?&with_networks=1024`,
	fetchHulu: `/discover/tv?&with_networks=453`,
	fetchDisney: `/discover/tv?&with_networks=2739`,
	fetchHBO: `/discover/tv?&with_networks=49`,

	fetchShows: `/tv/popular`,

	fetchRecommendations: `/recommendations`,

	fetchSimilarShows: `/discover/tv?with_networks=213`,
	fetchSimilarMovies: `/discover/movie?with_networks=49`,

	fetchDetails: `&language=en-US`,
	fetchVideos: `/videos`,
};

const fetchTMDBData = async (endpoint: string) => {
	const options = {
		method: "GET",
		url: `https://api.themoviedb.org/3/${endpoint}`,
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
		},
	};

	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		const err = error as AxiosError;
		if (err.response && err.response.status === 401) {
			console.error("Invalid API key.");
		} else if (err.response && err.response.status === 404) {
			return null;
		} else {
			console.error(err.message);
		}
	}
	return undefined;
};

export { requests, fetchTMDBData };
