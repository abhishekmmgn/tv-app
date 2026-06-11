const BASE = "https://image.tmdb.org/t/p";

/**
 * Art-directed splash image using <picture>.
 *
 * - Mobile (<640px):  poster w780  (portrait, matches aspect-9/16)
 * - sm–2xl:           backdrop w1280
 * - ≥2xl:             backdrop original
 *
 * Falls back to backdrop on mobile when poster is unavailable,
 * and to poster on desktop when backdrop is unavailable.
 */
export function SplashImage({
	backdrop_path,
	poster_path,
	alt,
	className,
	fetchPriority = "auto",
}: {
	backdrop_path?: string;
	poster_path?: string;
	alt: string;
	className?: string;
	fetchPriority?: "high" | "low" | "auto";
}) {
	if (!backdrop_path && !poster_path) return null;

	const poster780 = poster_path
		? `${BASE}/w780${poster_path}`
		: backdrop_path
			? `${BASE}/w780${backdrop_path}`
			: "";

	const backdrop1280 = backdrop_path
		? `${BASE}/w1280${backdrop_path}`
		: poster_path
			? `${BASE}/w780${poster_path}`
			: "";

	const backdropOriginal = backdrop_path
		? `${BASE}/original${backdrop_path}`
		: backdrop1280;

	return (
		<picture>
			{/* ≥2xl (1536px+): full-res backdrop for large displays */}
			<source media="(min-width: 1536px)" srcSet={backdropOriginal} />
			{/* sm–2xl (640px–1535px): w1280 backdrop */}
			<source media="(min-width: 640px)" srcSet={backdrop1280} />
			{/* <640px (mobile): poster w780 for correct portrait orientation */}
			<img
				src={poster780}
				alt={alt}
				fetchPriority={fetchPriority}
				decoding="async"
				className={className}
			/>
		</picture>
	);
}
