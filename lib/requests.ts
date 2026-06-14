function secondsUntilEndOfDay(): number {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

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

const fetchTMDBData = async (
  endpoint: string,
  options?: { revalidate?: number | false },
) => {
  let cleanEndpoint = endpoint;
  if (endpoint.includes("search/") || endpoint.includes("discover/")) {
    const queryStartIndex = endpoint.indexOf("?");
    if (queryStartIndex !== -1) {
      const path = endpoint.substring(0, queryStartIndex);
      const search = endpoint.substring(queryStartIndex + 1);
      const params = new URLSearchParams(search);
      if (!params.has("include_adult")) {
        params.set("include_adult", "false");
        cleanEndpoint = `${path}?${params.toString()}`;
      }
    } else {
      cleanEndpoint = `${endpoint}?include_adult=false`;
    }
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${cleanEndpoint}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
        next: { revalidate: options?.revalidate ?? secondsUntilEndOfDay() },
      },
    );

    if (response.status === 401) {
      console.error("Invalid API key.");
      return undefined;
    }
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      console.error(`TMDB request failed: ${response.status}`);
      return undefined;
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export async function fetchTMDBDataClient(endpoint: string) {
  try {
    const response = await fetch(`/api/tmdb/${endpoint}`);

    if (!response.ok) {
      console.error(`TMDB request failed: ${response.status}`);
      return undefined;
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export { requests, fetchTMDBData };
