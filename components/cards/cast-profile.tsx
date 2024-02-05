import Image from "next/image";
import personIcon from "@/public/person.png";

type PropsType = {
  name: string;
  image: string | null;
  character?: string;
  job?: string;
};

export default function CastProfile(props: PropsType) {
  return (
    <>
      <div className="relative w-24 md:w-28 xl:w-32 h-24 md:h-28 xl:h-32 bg-secondary rounded-full shadow-sm">
        <Image
          src={
            props.image !== null
              ? `https://image.tmdb.org/t/p/w185${props.image}`
              : personIcon
          }
          fill
          sizes="128px"
          alt={`Profile photo of ${props.name}`}
          className="object-cover rounded-full"
        />
      </div>
      <div className="mt-2 px-1 w-24 md:w-28 xl:w-32 whitespace-pre-line text-center">
        <h1 className="text-[0.9375rem] leading-tight font-medium">{props.name}</h1>
        <p className="mt-1 text-sm leading-tight text-neutral-400">
          {props.character || props.job}
        </p>
      </div>
    </>
  );
}
