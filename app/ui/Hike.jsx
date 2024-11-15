"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { convertDate, convertTime } from "@/app/lib/utils";
import { fetchTrailById, fetchUserById, addParticipant, removeParticipant } from "@/app/api/data";

export default function Hike({ hikeType, hikeInfo }) {
  const { currentUser, setHike } = useGlobal();
  const router = useRouter();
  const [trailInfo, setTrailInfo] = useState({
    trail_name: "",
    area_name: "",
    difficulty_rating: "",
    length: 0,
    elevation_gain: 0,
    route_type: "",
    trail_link: ""
  });
  const [creatorName, setCreatorName] = useState();

  useEffect(() => {
    const fetchTrailInfo = async () => {
      const info = await fetchTrailById(hikeInfo.trail_id);
      setTrailInfo(info[0]);
    };
    fetchTrailInfo();

    const fetchCreatorName = async () => {
      const info = await fetchUserById(hikeInfo.creator_id);
      const creatorInfo = info[0];
      setCreatorName(creatorInfo.user_name);
    };
    fetchCreatorName();
  }, []);

  let buttonMessage = "";
  if (hikeInfo.status !== "cancelled") {
    if (hikeType === "joined") {
      buttonMessage = "Opt Out";
    } else if (hikeType === "created") {
      buttonMessage = "Edit Hike";
    } else if (hikeType === "available") {
      buttonMessage = "Join Hike";
    }
  }
  const hikingDate = convertDate(hikeInfo.date);
  const hikingTime = convertTime(hikeInfo.time);

  function handleClick(e) {
    switch (e.target.value) {
      case "Join Hike":
        addParticipant(currentUser.id, e.target.name);
        router.push("/bio");
        break;
      case "Opt Out":
        removeParticipant(currentUser.id, e.target.name);
        router.push("/join-hike");
        break;
      case "Edit Hike":
        setHike(e.target.name);
        router.push("/edit-hike");
        break;
      default:
        console.log("Different button");
    }
  };

  return (
    <div className="hike">
      <h4>
        {hikeInfo.title}, with {creatorName ? creatorName : "Unknown"}
      </h4>
      <h5>{trailInfo.area_name}</h5>
      <h5>
        {hikingDate}, {hikingTime}, {hikeInfo.location}
      </h5>
      <p>
        {trailInfo.difficulty_rating} * {trailInfo.length} mi *{" "}
        {trailInfo.elevation_gain} ft * {trailInfo.route_type}
      </p>
      <p>{hikeInfo.comments}</p>
      <a href={trailInfo.trail_link} target="_blank">
        AllTrails Link
      </a>
      {buttonMessage.length > 0 && (
        <button
          className="hike-button"
          name={hikeInfo.id}
          value={buttonMessage}
          onClick={handleClick}
        >
          {buttonMessage}
        </button>
      )}
    </div>
  );
};
