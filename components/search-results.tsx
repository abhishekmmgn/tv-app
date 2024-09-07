import genreData from "@/lib/genreData";
import { CardGalleryWrapper } from "@/components/gallery/card-gallery";

type propsType = {
  queryType: "category" | "regular";
  term: string;
};

export default async function SearchResults(props: propsType) {
  if (props.queryType === "category") {
    const genreObject = genreData.find((item) => item.genre === props.term);
    const url = genreObject?.url || "";
    return (
      <div className="py-5 md:py-8 xl:py-12">
        <h1 className="px-5 md:px-8 xl:px-12 font-semibold text-xl lg:text-2xl mb-4 text-neutral-200">
          Search Category
        </h1>
        <CardGalleryWrapper title={props.term} type="poster" url={url} />
      </div>
    );
  } else if (props.queryType === "regular") {
    return (
      <div className="py-5 md:py-8 xl:py-12">
        <h1 className="px-5 md:px-8 xl:px-12 font-semibold text-xl lg:text-2xl mb-4 text-neutral-200">
          Search Results
        </h1>
        <div className="space-y-6">
          <CardGalleryWrapper
            title={`Movies on ${props.term}`}
            type="search-results"
            url={`search/movie?query=${props.term}`}
          />
          <CardGalleryWrapper
            title={`Shows on ${props.term}`}
            type="search-results"
            url={`search/tv?query=${props.term}`}
          />
        </div>
      </div>
    );
  }
}
