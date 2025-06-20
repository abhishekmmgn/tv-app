"use client";
import { useInView } from "@/lib/useInView";
import { useState, useEffect } from "react";
import CardGallery from "./card-gallery"; // not the wrapper!
import { CardGallerySkeleton } from "../skeletons";
import { fetchTMDBData } from "@/lib/requests";
import { CardType } from "@/types";

export default function LazyGallery({
  title,
  type,
  url,
}: {
  title: string;
  type: CardType;
  url: string;
}) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inView && !show) setShow(true);
  }, [inView, show]);

  useEffect(() => {
    if (show && !data && type !== "category") {
      setLoading(true);
      fetchTMDBData(url)
        .then((res) => setData(res))
        .finally(() => setLoading(false));
    }
  }, [show, url, data, type]);

  if (type === "category") {
    return (
      <div ref={ref}>
        <CardGallery data={[]} title={title} type={type} />
      </div>
    );
  }

  return (
    <div ref={ref}>
      {show && !loading && data ? (
        <CardGallery data={data} title={title} type={type} />
      ) : (
        <CardGallerySkeleton title={title} type={type} />
      )}
    </div>
  );
}
