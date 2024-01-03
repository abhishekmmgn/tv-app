import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import VideoCardGallery from "./video-gallery";
import PostersGallery from "./posters-gallery";
import CreditsGallery from "./credits-gallery";
import CategoriesGallery from "./categories-gallery";
import SeasonCardGallery from "./season-gallery";

type PropsType = {
  title: string;
  data: any;
  type:
    | "video"
    | "category"
    | "credits"
    | "poster"
    | "season"
    | "search-results";
};

export default function CardGallery(props: PropsType) {
  return (
    <div className="relative px-5 md:px-8 xl:px-12 group">
      {props.title && (
        <h1 className="font-semibold text-lg mb-3 text-neutral-200 capitalize">
          <span>{props.title}</span>
          <ChevronRight className="w-4 h-4 inline" />
        </h1>
      )}
      <div>
        <div className="flex gap-5 overflow-x-auto whitespace-nowrap no-scrollbar">
          {(() => {
            switch (props.type) {
              case "video":
                return <VideoCardGallery data={props.data} />;
              case "poster":
                return <PostersGallery data={props.data} />;
              case "search-results":
                return <PostersGallery data={props.data} />;
              case "credits":
                return <CreditsGallery data={props.data} />;
              case "category":
                return <CategoriesGallery />;
              case "season":
                return <SeasonCardGallery data={props.data} />;
              default:
                return <></>;
            }
          })()}
        </div>
        <div className="mt-5">
          <Separator />
        </div>
      </div>
    </div>
  );
}
