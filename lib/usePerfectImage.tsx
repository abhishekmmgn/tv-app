export function getSplashImageUrl(
	backdrop_path?: string,
	poster_path?: string,
): string {
	if (backdrop_path) return `https://image.tmdb.org/t/p/w780${backdrop_path}`;
	if (poster_path) return `https://image.tmdb.org/t/p/w500${poster_path}`;
	return "";
}
