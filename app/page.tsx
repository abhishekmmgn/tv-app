import HomeSplash from "@/components/cards/home-splash";
import HomeItems from "@/components/home-items";
import SuggestedForYou from "@/components/suggested-for-you";
import { TmdbList } from "@/lib/effect/schemas";
import { runServer } from "@/lib/effect/runtime";
import { TmdbClient } from "@/lib/effect/tmdb";
import { requests } from "@/lib/requests";
import { Effect } from "effect";

export const revalidate = 86400;

export default async function Home() {
	const { results: popular } = await runServer(
		Effect.gen(function* () {
			const tmdb = yield* TmdbClient;
			return yield* tmdb.get(requests.fetchTrendingToday, TmdbList);
		}),
	);
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
