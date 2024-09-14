import { categories } from "@/lib/data";
import type { CategoryCardType } from "@/types";
import { CategoryCard } from "../cards/suggestion-cards";

export default function CategoriesGallery() {
	return (
		<>
			{categories.map((category: CategoryCardType) => (
				<CategoryCard
					title={category.title}
					from={category.from}
					to={category.to}
					link={category.link}
					isGallery={true}
					key={`${category.title}-${category.from}-${category.to}`}
				/>
			))}
		</>
	);
}
