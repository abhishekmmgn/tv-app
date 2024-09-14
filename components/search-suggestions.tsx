import interleaveResults from "@/lib/interleaveResults";
import { fetchTMDBData } from "@/lib/requests";
import { BasicDataType } from "@/types";
import { useEffect, useState } from "react";
import SearchSuggestionsCard from "./cards/search-suggestions-card";
import { SearchSuggestionsCardSkeleton } from "./skeletons";

export default function SearchSuggestions(props: { searchQuery: string }) {
	const [data, setData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchSearchResults() {
			const promises = [
				fetchTMDBData(`search/movie?query=${props.searchQuery}`),
				fetchTMDBData(`search/tv?query=${props.searchQuery}`),
			];
			const [movieData, tvData] = await Promise.all(promises);
			const interleavedData = interleaveResults(
				movieData.results,
				tvData.results,
			);
			setData(interleavedData);
			setIsLoading(false);
		}

		fetchSearchResults();
	}, [props.searchQuery]);
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
