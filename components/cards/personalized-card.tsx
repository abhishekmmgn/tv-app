"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import usePerfectImage from "@/lib/usePerfectImage";
import { useEffect, useState } from "react";
import { auth } from "@/firebase-config";
import axios from "axios";
import FadeInWrapper from "../fadin-wrapper";

export default function PersonalizedCard() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    async function getPersonalizedRecommendation() {
      const data = await axios(
        "http://localhost:5000/get-personalized-recommendation"
      );
      console.log(data);
      setData(data);
    }
    console.log("Runs.");
    if (auth.currentUser) {
      getPersonalizedRecommendation();
    }
  }, [auth.currentUser]);

  return (
    <div className="relative w-full aspect-[9/16] max-h-[90vh] sm:aspect-video bg-secondary rounded-md">
      <FadeInWrapper>
        <Image
          src={usePerfectImage(data?.poster_path, data?.backdrop_path)}
          alt={`Poster of ${data?.name || data?.title}`}
          fill
          sizes="100vw"
          className="object-cover rounded-md"
        />
      </FadeInWrapper>
      <div className="z-10 absolute bottom-0 inset-x-0 h-[75%] bg-gradient-to-b from-transparent to-black flex flex-col justify-end items-center px-5 sm:px-8 xl:px-12 pb-6 sm:pb-10 rounded-b-md">
        <h1 className="font-bold text-2xl md:text-3xl w-[90%] lg:w-3/4 text-center line-clamp-1">
          {data?.name || data?.title}
        </h1>
        <p className="text-neutral-300 mb-4 w-3/4 lg:w-1/2 text-center line-clamp-1 sm:line-clamp-2">
          {data?.tagline || data?.overview}
        </p>
        <Link
          href={
            data?.first_air_date || data?.name
              ? `/tv/${data?.name}-${data?.id}`
              : `/movie/${data?.title}-${data?.id}`
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
