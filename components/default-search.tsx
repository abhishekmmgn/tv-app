import {
	CategoryCard,
	SuggestionCard,
} from "@/components/cards/suggestion-cards";
import { categories } from "@/lib/data";
import { fetchTMDBData, requests } from "@/lib/requests";
import { CategoryCardType } from "@/types";

export default async function DefaultSearch() {
	const data = await fetchTMDBData(requests.fetchTrendingToday);
	return (
		<div className="px-5 md:px-8 xl:px-12 py-5">
			<h1 className="font-semibold text-lg mb-4 text-neutral-200">
				Explore Popular Films, Series, and More
			</h1>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
				{categories.map((category: CategoryCardType) => (
					<CategoryCard
						title={category.title}
						link={category.link}
						from={category.from}
						to={category.to}
						key={`${category.title}-${category.from}-${category.to}`}
					/>
				))}
				{data?.results.slice(10).map((item: any, index: number) => (
					<SuggestionCard
						id={item.id}
						title={item.title || item.name}
						type={item.first_air_date || item.name ? "tv" : "movie"}
						key={index}
						image={item.backdrop_path || item.poster_path}
					/>
				))}
			</div>
		</div>
	);
}
