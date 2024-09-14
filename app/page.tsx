import HomeSplash from "@/components/cards/home-splash";
import PersonalizedCard from "@/components/cards/personalized-card";
import { CardGalleryWrapper } from "@/components/gallery/card-gallery";
import Library from "@/components/library";
import { CardGallerySkeleton } from "@/components/skeletons";
import { fetchTMDBData, requests } from "@/lib/requests";
import type { CardType } from "@/types";
import { Suspense } from "react";

export const revalidate = 300;

type PropsType = {
	title: string;
	url: string;
	type: CardType;
};
const items: PropsType[] = [
	{
		title: "Now Playing",
		url: requests.fetchNowPlaying,
		type: "poster",
	},
	{
		title: "Explore Shows",
		type: "poster",
		url: requests.fetchShows,
	},
	{
		title: "Future Releases",
		type: "poster",
		url: requests.fetchUpcoming,
	},
	{
		title: "All of Apple TV+",
		type: "poster",
		url: requests.fetchAppleTV,
	},
	{
		title: "All of Hulu",
		type: "poster",
		url: requests.fetchHulu,
	},
	{
		title: "All of Disney+",
		type: "poster",
		url: requests.fetchDisney,
	},
	{
		title: "All of HBO",
		type: "poster",
		url: requests.fetchHBO,
	},
];

export default async function Home() {
	const popular = await fetchTMDBData(requests.fetchTrendingToday);
	console.log("Home: ", popular);
	return (
		<>
			{/* <HomeSplash data={popular?.results[0]} />
      <div className="py-6 space-y-6">
        {items
          .slice(0, items.length / 2)
          .map((item: PropsType, idx: number) => (
            <Suspense
              fallback={
                <CardGallerySkeleton title={item.title} type="poster" />
              }
              key={idx}
            >
              <CardGalleryWrapper
                title={item.title}
                type={item.type}
                url={item.url}
              />
            </Suspense>
          ))}
        <Library />
        <CardGalleryWrapper
          title="Explore by Category"
          type="category"
          url=""
        />
        <div className="px-5 md:px-8 xl:px-12">
          <PersonalizedCard data={popular?.results[1]} />
        </div>
        {items
          .slice(items.length / 2, items.length)
          .map((item: PropsType, idx: number) => (
            <Suspense
              fallback={
                <CardGallerySkeleton title={item.title} type="poster" />
              }
              key={idx}
            >
              <CardGalleryWrapper
                title={item.title}
                type={item.type}
                url={item.url}
              />
            </Suspense>
          ))}
        <div className="px-5 md:px-8 xl:px-12">
          <PersonalizedCard data={popular?.results[2]} />
        </div>
      </div> */}
		</>
	);
}
