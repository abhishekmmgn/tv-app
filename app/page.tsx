import HomeSplash from "@/components/cards/home-splash";
import HomeItems from "@/components/home-items";
import SuggestedForYou from "@/components/suggested-for-you";
import { fetchTMDBData, requests } from "@/lib/requests";
import type { DataListType } from "@/types";

export const revalidate = 86400;

export default async function Home() {
	const popularRes = await fetchTMDBData(requests.fetchTrendingToday);
	const popular: DataListType[] = popularRes.results;
	return (
		<>
			<HomeSplash data={popular[0]} />
			<div className="pt-6">
				<SuggestedForYou />
			</div>
			<HomeItems popular={popular.slice(1, 3)} />
		</>
	);
}
