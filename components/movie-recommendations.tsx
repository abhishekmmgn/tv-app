"use client";

import React, { useEffect, useState } from "react";
import CardGalleryWrapper from "./wrapper/card-gallery-wrapper";
import CardGallery from "./gallery/card-gallery";
import axios from "axios";
import { auth } from "@/firebase-config";

type PropsType = {
  item: string;
  id: string;
  title: string;
  name: string;
};
function MovieRecommendations(props: PropsType) {
  // first fetch recommendations, if didn't get the use other strategy.

  const [data, setData] = useState<any>(null);
  useEffect(() => {
    async function getPersonalizedRecommendation() {
      const data = await axios(
        "http://localhost:5000/get-personalized-recommendation"
      );
      console.log(data)
      setData(data);
    }
    console.log("Runs.")
    if (auth.currentUser) {
      getPersonalizedRecommendation();
    }
  }, [auth.currentUser]);

  if (data) {
    return (
      <CardGallery
        title={`Recommendations for ${props.title || props.name}`}
        type="poster"
        data={data}
      />
    );
  }
  return (
    <CardGalleryWrapper
      title={`Recommendations for ${props.title || props.name}`}
      type="poster"
      url={`${props.item}/${props.id}/recommendations`}
    />
  );
}

export default MovieRecommendations;
