import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { itemType } from "@/types";
import noItemLandscape from "../../public/noItemLandscape.png";

export default function SearchSuggestionsCard(props: itemType) {
  const link = props.isAShow
    ? `/tv/${props.title}-${props.id}`
    : `/movie/${props.title}-${props.id}`;
  return (
    <Link href={link}>
      <div className="h-16 w-full bg-background">
        <div className="flex gap-2 p-2 items-center justify-start">
          <Image
            src={
              props.image
                ? `https://image.tmdb.org/t/p/w92${props.image}`
                : noItemLandscape
            }
            width={160}
            height={90}
            alt={props.title}
            sizes="64px"
            className="object-cover w-20 aspect-video bg-background/50 rounded-md border-2"
          />
          <div>
            <p className="text-sm line-clamp-1 w-full">{props.title}</p>
            <p className="text-[0.75rem] text-gray-200 line-clamp-1 w-full">
              {props.isAShow ? "Show" : "Movie"}
            </p>
          </div>
        </div>
        <Separator />
      </div>
    </Link>
  );
}
