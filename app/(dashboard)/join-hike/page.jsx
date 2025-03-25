"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { fetchHikesToJoin } from "@/app/hooks/fetchHikesToJoin";
import { useState, useEffect } from "react";
import HikeComponent from "@/app/ui/components/HikeComponent";

function JoinHike() {
  const { currentUser, triggerRefresh, setTriggerRefresh } = useGlobal();
  const [hikeList, setHikeList] = useState([]);
  const [message, setMessage] = useState("Loading hikes...");

  useEffect(() => {
    const fetchHikes = async () => {
      try {
        const availableHikes = await fetchHikesToJoin(currentUser.id);
        if (availableHikes && availableHikes.length > 0) {
          setHikeList(availableHikes);
          setMessage("");
        } else {
          setHikeList([]);
          setMessage("No hikes are available to join.");
        }
      } catch (err) {
        setMessage("Failed to fetch hikes. Please try again later.");
      }
    };
    fetchHikes();
    setTriggerRefresh(false);
  }, [triggerRefresh, currentUser.id]);

  return (
    <div id="join-hike" className="">
      <p className="text-center font-bold m-2">Select a hike you would like to join:</p>
      <div className="hike-section">
      {message && <div className="message">{message}</div>}
      {hikeList?.map((hike) => (
            <HikeComponent hikeType="available" hikeInfo={hike} key={hike.id} />
          ))}
      </div>
    </div>
  );
}
export default JoinHike;

