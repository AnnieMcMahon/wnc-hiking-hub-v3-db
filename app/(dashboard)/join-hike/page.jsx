"use client";

import Hike from "@/app/ui/Hike";
import { useGlobal } from "@/app/context/GlobalContext";
import { fetchHikesToJoin } from "@/app/api/data";
import { useState, useEffect } from "react";
import "./join-hike.css";

async function JoinHike() {
  const { currentUser } = useGlobal();
  const [hikeList, setHikeList] = useState([]);

  useEffect(() => {
    const fetchHikes = async () => {
      const availableHikes = await fetchHikesToJoin(currentUser.id);
      setHikeList(availableHikes);
    };
   fetchHikes();
}, []);

  return (
    <div id="join-hike">
      <h3>Select a hike you would like to join:</h3>
      <div className="hike-section">
        {hikeList?.map((hike) => (
          <Hike hikeType="available" hikeInfo={hike} key={hike.id} />
        ))}
      </div>
    </div>
  );
}
export default JoinHike;
