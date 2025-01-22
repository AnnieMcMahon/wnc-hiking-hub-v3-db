"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { fetchHikesToJoin } from "@/app/hooks/fetchHikesToJoin";
import { useState, useEffect } from "react";
import HikeComponent from "@/app/ui/components/HikeComponent";
import "./join-hike.css";

function JoinHike() {
  const { currentUser, triggerRefresh, setTriggerRefresh } = useGlobal();
  const [hikeList, setHikeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHikes = async () => {
      setLoading(true);
      setError(null);
      try {
        const availableHikes = await fetchHikesToJoin(currentUser.id);
        if (availableHikes && availableHikes.length > 0) {
          setHikeList(availableHikes);
        } else {
          setHikeList([]);
        }
      } catch (err) {
        setError("Failed to fetch hikes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHikes();
    setTriggerRefresh(false);
  }, [triggerRefresh]);

  return (
    <div id="join-hike">
      <h3>Select a hike you would like to join:</h3>
      <div className="hike-section">
        {loading ? (
          <div className="loading-message">Loading hikes...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : hikeList.length === 0  ? (
          <div className="no-hikes-message">No hikes are available to join.</div>
        ) : (
          hikeList.map((hike) => (
            <HikeComponent hikeType="available" hikeInfo={hike} key={hike.id} />
          ))
        )}
      </div>
    </div>
  );
}
export default JoinHike;
