"use client";

import interleaveResults from "@/lib/interleaveResults";
import { useBrowserEffect } from "@/hooks/use-effect";
import { TmdbList } from "@/lib/effect/schemas";
import { tmdbGet } from "@/lib/effect/tmdb";
import { Effect } from "effect";
import { BasicDataType } from "@/types";
import { useMemo } from "react";
import SearchSuggestionsCard from "./cards/search-suggestions-card";
import { SearchSuggestionsCardSkeleton } from "./skeletons";

export default function SearchSuggestions(props: { searchQuery: string }) {
	const effect = useMemo(() => {
		const q = encodeURIComponent(props.searchQuery);
		// One failed search just contributes no results.
		const search = (kind: "movie" | "tv") =>
			tmdbGet(`search/${kind}?query=${q}`, TmdbList).pipe(
				Effect.catch(() => Effect.succeed(null)),
			);
		return Effect.all([search("movie"), search("tv")], { concurrency: 2 });
	}, [props.searchQuery]);
	const { data: responses, loading: isLoading } = useBrowserEffect(effect);

	const data = useMemo(() => {
		const [movieData, tvData] = responses ?? [null, null];
		return interleaveResults(
			(movieData?.results ?? []).filter((item) => !item.adult),
			(tvData?.results ?? []).filter((item) => !item.adult),
		);
	}, [responses]);
	return (
		<>
			{isLoading &&
				Array.from({ length: 8 }).map((_, index) => (
					<SearchSuggestionsCardSkeleton key={index} />
				))}
			{data && (
				<>
					{data.map((item: BasicDataType) => (
						<SearchSuggestionsCard
							key={item.id}
							id={item.id}
							title={item.title}
							image={item.image}
							type={item.type}
						/>
					))}
				</>
			)}
		</>
	);
}
