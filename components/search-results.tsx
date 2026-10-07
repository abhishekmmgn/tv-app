import Pagination from "@/components/pagination";
import PosterCard from "@/components/cards/poster-card";
import genreData from "@/lib/genreData";
import type { ItemType } from "@/types";
import type { TmdbItem } from "@/lib/effect/schemas";
import { runServerOrNull } from "@/lib/effect/runtime";
import { TmdbList } from "@/lib/effect/schemas";
import { tmdbGet } from "@/lib/effect/tmdb";
import noItem from "@/public/no-item.png";
import { Suspense } from "react";

function buildPosterImage(
	posterPath?: string | null,
	backdropPath?: string | null,
) {
	if (posterPath) return `https://image.tmdb.org/t/p/w342${posterPath}`;
	if (backdropPath) return `https://image.tmdb.org/t/p/w300${backdropPath}`;
	return noItem;
}

type propsType = {
	queryType: "category" | "regular";
	term: string;
	page: number;
};

export default async function SearchResults(props: propsType) {
	const q = encodeURIComponent(props.term);

	if (props.queryType === "category") {
		const genreObject = genreData.find((item) => item.genre === props.term);
		const baseUrl = genreObject?.url ?? "";

		// Fetch 2 discover pages in parallel → 40 items
		const tmdbPage1 = props.page * 2 - 1;
		const tmdbPage2 = props.page * 2;
		const [data1, data2] = await Promise.all([
			runServerOrNull(tmdbGet(`${baseUrl}&page=${tmdbPage1}`, TmdbList)),
			runServerOrNull(tmdbGet(`${baseUrl}&page=${tmdbPage2}`, TmdbList)),
		]);

		const results = [
			...(data1?.results ?? []),
			...(data2?.results ?? []),
		].filter((item) => !item.adult);
		const totalPages = Math.ceil((data1?.total_pages ?? 1) / 2);
		const totalResults: number = data1?.total_results ?? 0;

		return (
			<div className="horizontal-padding py-5 md:py-8">
				<div className="flex items-baseline gap-3 mb-4 capitalize">
					<h1 className="font-semibold text-xl lg:text-2xl text-neutral-200">
						{props.term.replace(/-/g, " ")}
					</h1>
					{totalResults > 0 && (
						<span className="text-muted-foreground text-sm">
							{totalResults.toLocaleString()} results
						</span>
					)}
				</div>

				{results.length === 0 ? (
					<p className="text-muted-foreground py-12 text-center">
						No results found.
					</p>
				) : (
					<>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
							{results.map((item) => (
								<PosterCard
									key={item.id}
									className="w-full"
									id={item.id}
									title={item.title || item.name || ""}
									type={item.first_air_date ? "tv" : "movie"}
									image={buildPosterImage(item.poster_path, item.backdrop_path)}
								/>
							))}
						</div>
						{totalPages > 1 && (
							<Suspense>
								<Pagination totalPages={totalPages} />
							</Suspense>
						)}
					</>
				)}
			</div>
		);
	}

	// Regular search: fetch movie + TV in parallel, interleave all results
	const [movieData, tvData] = await Promise.all([
		runServerOrNull(
			tmdbGet(`search/movie?query=${q}&page=${props.page}`, TmdbList),
		),
		runServerOrNull(
			tmdbGet(`search/tv?query=${q}&page=${props.page}`, TmdbList),
		),
	]);

	const movies = (movieData?.results ?? []).filter((item) => !item.adult);
	const shows = tvData?.results ?? [];
	const interleaved: (TmdbItem & { media_type: ItemType })[] = [];
	const maxLen = Math.max(movies.length, shows.length);
	for (let i = 0; i < maxLen; i++) {
		if (i < movies.length) interleaved.push({ ...movies[i], media_type: "movie" as const });
		if (i < shows.length) interleaved.push({ ...shows[i], media_type: "tv" as const });
	}
	const results = interleaved.slice(0, 20);

	const totalPages = Math.max(
		movieData?.total_pages ?? 1,
		tvData?.total_pages ?? 1,
	);
	const totalResults =
		(movieData?.total_results ?? 0) + (tvData?.total_results ?? 0);

	return (
		<div className="horizontal-padding py-5 md:py-8">
			<div className="flex items-baseline gap-3 mb-4">
				<h1 className="font-semibold text-xl lg:text-2xl text-neutral-200">
					Search Results
				</h1>
				{totalResults > 0 && (
					<span className="text-muted-foreground text-sm">
						{totalResults.toLocaleString()} results
					</span>
				)}
			</div>

			{results.length === 0 ? (
				<p className="text-muted-foreground py-12 text-center">
					No results found for &ldquo;{props.term}&rdquo;
				</p>
			) : (
				<>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
						{results.map((item) => (
							<PosterCard
								key={`${item.media_type}-${item.id}`}
								className="w-full"
								id={item.id}
								title={item.title || item.name || ""}
								type={item.media_type}
								image={buildPosterImage(item.poster_path, item.backdrop_path)}
							/>
						))}
					</div>
					{totalPages > 1 && (
						<Suspense>
							<Pagination totalPages={totalPages} />
						</Suspense>
					)}
				</>
			)}
		</div>
	);
}
