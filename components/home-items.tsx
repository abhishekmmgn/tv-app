import PersonalizedCard from "@/components/cards/personalized-card";
import { CardGalleryWrapper } from "@/components/gallery/card-gallery";
import { CardGallerySkeleton } from "@/components/skeletons";
import type { CardType } from "@/types";
import { Suspense } from "react";
import { requests } from "@/lib/requests";
import type { DataListType } from "@/types";
import LazyGallery from "./gallery/lazy-gallery";

export default function HomeItems({ popular }: { popular: DataListType[] }) {
  // Split items: first 2 are above the fold, rest are lazy
  const firstHalf = items.slice(0, 2);
  const secondHalf = items.slice(2);
  return (
    <div className="py-6 space-y-6">
      {firstHalf.map((item: PropsType, idx: number) => (
        <Suspense
          fallback={<CardGallerySkeleton title={item.title} type="poster" />}
          key={idx}
        >
          <CardGalleryWrapper
            title={item.title}
            type={item.type}
            url={item.url}
          />
        </Suspense>
      ))}
      <CardGalleryWrapper title="Explore by Category" type="category" url="" />
      <div className="px-5 md:px-8 xl:px-12">
        <PersonalizedCard data={popular[0]} />
      </div>
      {secondHalf.map((item: PropsType, idx: number) => (
        <LazyGallery
          key={item.title}
          title={item.title}
          type={item.type}
          url={item.url}
        />
      ))}
      <div className="px-5 md:px-8 xl:px-12">
        <PersonalizedCard data={popular[1]} />
      </div>
    </div>
  );
}

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
