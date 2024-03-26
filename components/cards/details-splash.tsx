"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import { Check, Share } from "lucide-react";
import { isInWatchlist, addToWatchlist } from "@/lib/watchlist";
import toast from "react-hot-toast";
import { UserAuth } from "@/providers/auth-provider";
import handleCopyLink from "@/lib/handleCopyLink";
import { useState, useEffect } from "react";
import usePerfectImage from "@/lib/usePerfectImage";

type PropsType = {
  id: number;
  title: string;
  images: { backdrop_path: string; poster_path: string };
  tagline?: string;
  overview?: string;
  isAShow: boolean;
};

export default function DetailsSplash(props: PropsType) {
  const [watched, setWatched] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { user } = UserAuth();

  const link = props.isAShow
    ? `/tv/${props.title}-${props.id}`
    : `/movie/${props.title}-${props.id}`;

  useEffect(() => {
    if (user) {
      isInWatchlist(props.id, user?.uid).then((result) => {
        setWatched(result);
      });
    }
  }, [user, props.id]);

  async function handleAddToWatchlist(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setDisabled(true);
    if (user) {
      try {
        await addToWatchlist(props.id, props.title, user?.uid);
        toast.success(`Added to your watchlist.`);
        setWatched(true);
      } catch (error) {
        toast.error(`Failed to add.`);
      }
    } else {
      toast.error("You must be logged in.");
    }
    setDisabled(false);
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setDisabled(true);
    const success = handleCopyLink(event, link);
    if (success) {
      toast.success("Link copied successfully");
    } else {
      toast.error("Failed to copy link");
    }
    setDisabled(false);
  };

  console.log("Runs.");
  return (
    <div className="w-full relative aspect-[9/16] max-h-[90vh] sm:aspect-video sm:max-h-max bg-secondary">
      <Image
        src={usePerfectImage(
          props.images?.poster_path,
          props.images?.backdrop_path
        )}
        alt={`Poster of ${props?.title}`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="z-10 absolute bottom-0 inset-x-0 h-[70%] bg-gradient-to-b from-black/0 to-black flex flex-col justify-end items-center sm:items-start px-5 sm:px-8 xl:px-12 pb-6 sm:pb-10">
        <h1 className="font-bold text-2xl md:text-3xl w-[90%] lg:w-3/4 text-center sm:text-left line-clamp-2">
          {props.title}
        </h1>
        <p className="text-neutral-300 mb-4 w-3/4 lg:w-1/2 text-center sm:text-left line-clamp-2">
          {props.tagline || props.overview}
        </p>
        {!watched && (
          <Button
            size="lg"
            className="mb-2 w-64 flex gap-2"
            disabled={disabled}
            onClick={handleAddToWatchlist}
          >
            <Check className="w-4 h-4" />
            Mark as Watched
          </Button>
        )}
        <Button
          size="lg"
          className="w-64 flex gap-2"
          disabled={disabled}
          onClick={handleClick}
        >
          <Share className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
