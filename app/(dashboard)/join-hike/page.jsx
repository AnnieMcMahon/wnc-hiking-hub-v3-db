"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { fetchHikesToJoin } from "@/app/api/data/data";
import { useState, useEffect } from "react";
import HikeComponent from "@/app/ui/components/HikeComponent";
import "./join-hike.css";

function JoinHike() {
  const { currentUser, triggerRefresh, setTriggerRefresh } = useGlobal();
  const [hikeList, setHikeList] = useState();

  useEffect(() => {
    const fetchHikes = async () => {
      const availableHikes = await fetchHikesToJoin(currentUser.id);
      setHikeList(availableHikes);
    };
    fetchHikes();
    setTriggerRefresh(false);
  }, [triggerRefresh]);

  return (
    <div id="join-hike">
      <h3>Select a hike you would like to join:</h3>
      <div className="hike-section">
        {hikeList?.map((hike) => (
          <HikeComponent hikeType="available" hikeInfo={hike} key={hike.id} />
        ))}
      </div>
    </div>
  );
}
export default JoinHike;
