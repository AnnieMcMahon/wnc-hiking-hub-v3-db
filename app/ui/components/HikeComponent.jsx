"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { convertDate, convertTime } from "@/app/lib/utils";
import {
  fetchTrailById,
  fetchUserById,
  addParticipant,
  removeParticipant,
} from "@/app/api/data/data";
import { BLANK_HIKE, BLANK_TRAIL } from "@/app/lib/constants";
import HikePost from "@/app/ui/components/HikePost";

export default function HikeComponent({
  hikeType = "",
  hikeInfo = BLANK_HIKE
}) {
  const { currentUser, setHike, triggerRefresh, setTriggerRefresh } = useGlobal();
  const router = useRouter();
  const [hikeDisplay, setHikeDisplay] = useState(BLANK_HIKE);
  const [trail, setTrail] = useState(BLANK_TRAIL);

  const fetchTrailInfo = async () => {
    const info = await fetchTrailById(hikeInfo.trail_id);
    const trailInfo = info[0];
    if (trailInfo) {
      setTrail(trailInfo);
    }
  };

  const fetchCreatorName = async () => {
    const info = await fetchUserById(hikeInfo.creator_id);
    const creatorInfo = info[0];
    setHikeDisplay((prevState) => ({
      ...prevState,
      creator: creatorInfo ? creatorInfo.user_name : "unknown",
    }));
  };

  const fetchButtonMessage = (status, type) => {
    let message = "";
    if (status !== "cancelled") {
      if (type === "joined") {
        message = "Opt Out";
      } else if (type === "created") {
        message = "Edit Hike";
      } else if (type === "available") {
        message = "Join Hike";
      }
    }
    return message;
  };

  useEffect(() => {
    const buttonMessage = fetchButtonMessage(hikeInfo.status, hikeType);
    const hikingDate = convertDate(hikeInfo.date);
    const hikingTime = convertTime(hikeInfo.time);
    setHikeDisplay({
      id: hikeInfo.id,
      title: hikeInfo.title,
      date: hikingDate,
      time: hikingTime,
      location: hikeInfo.location,
      comments: hikeInfo.comments,
      buttonMessage: buttonMessage,
    });
    fetchTrailInfo();
    fetchCreatorName();
  }, []);

  function handleClick(buttonMessage, hikeId) {
    hikeId = Number(hikeId);
    switch (buttonMessage) {
      case "Join Hike":
        addParticipant(currentUser.id, hikeId);
        setTriggerRefresh(true);
        break;
      case "Opt Out":
        removeParticipant(currentUser.id, hikeId);
        setTriggerRefresh(true);
        break;
      case "Edit Hike":
        setHike(hikeId);
        router.push("/edit-hike");
        break;
    }
  }

  return (
    <HikePost hikeInfo={hikeDisplay} trail={trail} onClick={handleClick} />
  );
}
