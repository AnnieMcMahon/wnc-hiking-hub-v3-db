"use client";
import Hike from "@/app/ui/Hike";
import { useGlobal } from "@/app/context/GlobalContext";
import { fetchHikesToJoin } from "@/app/api/data";
import { defaultHike } from "@/app/lib/defaultContent";
import { useState, useEffect } from "react";
import "./join-hike.css";

function JoinHike() {
  const { currentUser } = useGlobal();
  const [hikeList, setHikeList] = useState([defaultHike]);

  useEffect(() => {
    const fetchHikes = async () => {
      const availableHikes = await fetchHikesToJoin(currentUser);
      setHikeList(availableHikes);
    };
    fetchHikes();
}, []);

  return (
    <div id="join-hike">
      <h3>Select a hike you would like to join:</h3>
      <div className="hike-section">
        {hikeList.map((hike) => (
          <Hike hikeType="available" hikeInfo={hike} key={hike.id} />
        ))}
      </div>
    </div>
  );
}
export default JoinHike;
