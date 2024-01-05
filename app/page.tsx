import HomeSplash from "@/components/cards/home-splash";
import PersonalizedCard from "@/components/cards/personalized-card";
import { requests, fetchTMDBData } from "@/lib/requests";
import CardGalleryWrapper from "@/components/wrapper/card-gallery-wrapper";
import CardGallery from "@/components/gallery/card-gallery";

// export const revalidate = 30;
export const dynamic = "force-dynamic";

export default async function Home() {
  const popular = await fetchTMDBData(requests.fetchTrendingToday);
  return (
    <div>
      <HomeSplash data={popular?.results[Math.floor(Math.random() * 5)]} />
      <div className="py-6 space-y-6">
        <CardGallery
          title="What's Popular"
          type="poster"
          data={popular}
        />
        <CardGalleryWrapper
          title="Now Playing"
          type="poster"
          url={requests.fetchNowPlaying}
        />
        <CardGalleryWrapper
          title="Explore Shows"
          type="poster"
          url={requests.fetchShows}
        />
        <CardGalleryWrapper
          title="Future Releases"
          type="poster"
          url={requests.fetchUpcoming}
        />
        <div className="px-5 md:px-8 xl:px-12">
          <PersonalizedCard
            data={popular.results[Math.floor(Math.random() * 10) + 5]}
          />
        </div>
        <CardGalleryWrapper
          title="Explore by Category"
          type="category"
          url=""
        />
        <CardGalleryWrapper
          title="All of Apple TV+"
          type="poster"
          url={requests.fetchAppleTV}
        />
        <CardGalleryWrapper
          title="All of Hulu"
          type="poster"
          url={requests.fetchHulu}
        />
        <CardGalleryWrapper
          title="All of Disney+"
          type="poster"
          url={requests.fetchDisney}
        />
        <CardGalleryWrapper
          title="All of HBO"
          type="poster"
          url={requests.fetchHBO}
        />
        <div className="px-5 md:px-8 xl:px-12">
          <PersonalizedCard
            data={popular.results[Math.floor(Math.random() * 15) + 5]}
          />
        </div>
      </div>
    </div>
  );
}
