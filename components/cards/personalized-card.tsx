"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import usePerfectImage from "@/lib/usePerfectImage";
import FadeInWrapper from "../fadin-wrapper";

export default function PersonalizedCard(props: { data: any }) {
  return (
    <div className="relative w-full aspect-[9/16] max-h-[90vh] sm:aspect-video bg-secondary rounded-md">
      <FadeInWrapper>
        <Image
          src={usePerfectImage(
            props.data?.poster_path,
            props.data?.backdrop_path
          )}
          alt={`Poster of ${props.data?.name || props.data?.title}`}
          fill
          sizes="100vw"
          className="object-cover rounded-md"
        />
      </FadeInWrapper>
      <div className="z-10 absolute bottom-0 inset-x-0 h-[75%] bg-gradient-to-b from-transparent to-black flex flex-col justify-end items-center px-5 sm:px-8 xl:px-12 pb-6 sm:pb-10 rounded-b-md">
        <h1 className="font-bold text-2xl md:text-3xl w-[90%] lg:w-3/4 text-center line-clamp-1">
          {props.data?.name || props.data?.title}
        </h1>
        <p className="text-neutral-300 mb-4 w-3/4 lg:w-1/2 text-center line-clamp-1 sm:line-clamp-2">
          {props.data?.tagline || props.data?.overview}
        </p>
        <Link
          href={
            props.data?.first_air_date || props.data?.name
              ? `/tv/${props.data?.name}-${props.data?.id}`
              : `/movie/${props.data?.title}-${props.data?.id}`
          }
        >
          <Button size="lg" className="w-48">
            Watch
          </Button>
        </Link>
      </div>
    </div>
  );
}
