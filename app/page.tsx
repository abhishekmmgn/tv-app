import HomeSplash from "@/components/cards/home-splash";
import PersonalizedCard from "@/components/cards/personalized-card";
import { requests, fetchTMDBData } from "@/lib/requests";
import CardGalleryWrapper from "@/components/wrapper/card-gallery-wrapper";

export const revalidate = 300;

export default async function Home() {
  const popular = await fetchTMDBData(requests.fetchTrendingToday);
  return (
    <>
      <HomeSplash data={popular?.results[0]} />
      <div className="py-6 space-y-6">
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
          <PersonalizedCard />
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
          <PersonalizedCard />
        </div>
      </div>
    </>
  );
}
