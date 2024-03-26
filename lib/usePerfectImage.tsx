"use client";

import { useMediaQuery } from "usehooks-ts";

type PropsType = {
  poster_path: string;
  backdrop_path: string;
};

export default function usePerfectImage(
  poster_path: string,
  backdrop_path: string
) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const isLargeWidthDesktop = useMediaQuery("(min-width: 1280px)");
  return isDesktop
    ? `https://image.tmdb.org/t/p/${
        isLargeWidthDesktop ? "original" : "w1280"
      }${backdrop_path}`
    : `https://image.tmdb.org/t/p/w780${poster_path}`;
}
