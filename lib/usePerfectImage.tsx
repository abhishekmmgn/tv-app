"use client";

import { useMediaQuery } from "usehooks-ts";

export default function usePerfectImage(
  poster_path: string,
  backdrop_path: string
) {
  const isDesktop = useMediaQuery("(min-width: 640px)", {
    defaultValue: true,
    initializeWithValue: false,
  });
  const isLargeWidthDesktop = useMediaQuery("(min-width: 1280px)", {
    defaultValue: true,
    initializeWithValue: false,
  });
  const image = isDesktop
    ? `https://image.tmdb.org/t/p/${
        isLargeWidthDesktop ? "original" : "w1280"
      }/${backdrop_path}`
    : `https://image.tmdb.org/t/p/w780/${poster_path}`;
  return image;
}
