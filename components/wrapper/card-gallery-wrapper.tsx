"use client";

import { useState, useEffect } from "react";
import { fetchTMDBData } from "@/lib/requests";
import CardGallery from "../gallery/card-gallery";
import { CardGallerySkeleton } from "../skeletons";

export const dynamic = "force-dynamic";

type PropsType = {
  title: string;
  url: string;
  type:
    | "video"
    | "category"
    | "credits"
    | "poster"
    | "season"
    | "search-results";
};

export default function CardGalleryWrapper(props: PropsType) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchTMDBData(props.url);
        setResult(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [props.url]);

  return (
    <>
      {loading ? (
        <CardGallerySkeleton type="poster" />
      ) : (
        <CardGallery data={result} title={props.title} type={props.type} />
      )}
    </>
  );
}
