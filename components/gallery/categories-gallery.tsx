import { CategoryCard } from "../cards/suggestion-cards";
import { categories } from "@/lib/data";

export default function CategoriesGallery() {
  return (
    <>
      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          title={category.title}
          from={category.from}
          to={category.to}
          link={category.link}
          gallery={true}
        />
      ))}
    </>
  );
}