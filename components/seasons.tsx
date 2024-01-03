"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CardGallery from "./gallery/card-gallery";
import { fetchTMDBData } from "@/lib/requests";

export default function Seasons(props: { id: string; seasons: number }) {
  const [currentSeason, setCurrentSeason] = useState(1);
  const [data, setData] = useState<null | any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchTMDBData(`tv/${props.id}/season/${currentSeason}`);
      setData(res);
    };

    fetchData();
  }, [props.id, currentSeason]);

  return (
    <div className="space-y-2">
      <Select
        defaultValue="season-1"
        onValueChange={(value) =>
          setCurrentSeason(parseInt(value.split("-")[1]))
        }
      >
        <SelectTrigger className="w-[180px] px-5 md:px-8 xl:px-12">
          <SelectValue placeholder="Season" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Array.from({ length: props.seasons }, (_, i) => (
              <SelectItem key={i} value={`season-${i + 1}`}>
                Season {i + 1}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <CardGallery title="Episodes" type="season" data={data} />
    </div>
  );
}
