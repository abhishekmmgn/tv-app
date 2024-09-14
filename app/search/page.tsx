import DefaultSearch from "@/components/default-search";
import SearchBar from "@/components/search-bar";
import SearchResults from "@/components/search-results";
import type { Metadata } from "next";

export const revalidate = 300;

type Props = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({ searchParams }: Props): Metadata {
	const categoryTerm = searchParams.category?.toString();
	const term = searchParams.query?.toString();
	return {
		title: term || categoryTerm ? `Search: ${term || categoryTerm}` : "Search",
	};
}

export default function SearchPage({ searchParams }: Props) {
	const categoryTerm = searchParams.category?.toString();
	const term = searchParams.query?.toString();
	return (
		<>
			<div className="pt-5 px-5 space-y-3 sm:hidden">
				<h1 className="text-2xl font-bold">Search</h1>
				<SearchBar />
			</div>
			{term || categoryTerm ? (
				<>
					{term && <SearchResults term={term} queryType="regular" />}
					{categoryTerm && (
						<SearchResults term={categoryTerm} queryType="category" />
					)}
				</>
			) : (
				<DefaultSearch />
			)}
		</>
	);
}
