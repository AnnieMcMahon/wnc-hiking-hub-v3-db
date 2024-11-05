"use client";

import Hike from "@/app/components/Hike";
import { useGlobal } from "../context/GlobalContext";

import "./join-hike.css";

function JoinHike() {
  const { hikes, currentUser } = useGlobal();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  let sortedHikeList = [];
  hikes.forEach((hike) => {
    const hikeDate = new Date(hike.date);
    hikeDate.setHours(0, 0, 0, 0);
    if (hikeDate >= currentDate) {
      if (hike.creator !== currentUser.id) {
        if (currentUser.hikes.indexOf(hike.id) == -1) {
          if (!hike.title.includes("CANCELLED"))
            sortedHikeList.push(hike);
        }
      }
    }
  });

  if (sortedHikeList.length > 1) {
    sortedHikeList.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return (
    <div id="join-hike">
      <h3>Select a hike you would like to join:</h3>
      <div className="hike-section">
        {sortedHikeList.map(hike => 
        <Hike hikeType="available" hikeInfo={hike} key={hike.id}/>
        )}
      </div>
    </div>
  );
}
export default JoinHike;
