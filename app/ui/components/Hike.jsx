"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { convertDate, convertTime, fetchButtonMessage } from "@/app/lib/utils";
import {
  fetchTrailById,
  fetchUserById,
  addParticipant,
  removeParticipant,
} from "@/app/api/data/data";
import HikePost from "@/app/ui/components/HikePost";
export default function Hike({ hikeType, hikeInfo }) {
  const { currentUser, setHike } = useGlobal();
  const router = useRouter();
  const [hikeDisplay, setHikeDisplay] = useState({
    id: null,
    title: "",
    location: "",
    comments: "",
    creator: "",
    buttonMessage: "",
    time: null,
    date: null
  });

  const [trail, setTrail] = useState({
    trail_name: "",
    area_name: "",
    difficulty_rating: "",
    length: null,
    elevation: null,
    route_type: "",
    trail_link: "",
  });

  const fetchTrailInfo = async () => {
    const info = await fetchTrailById(hikeInfo.trail_id);
    const trailInfo = info[0];
    if (trailInfo) {
      setTrail(trailInfo);
  };
};

  const fetchCreatorName = async () => {
    const info = await fetchUserById(hikeInfo.creator_id);
    const creatorInfo = info[0];
    if (creatorInfo) {
      setHikeDisplay((prevState) => ({
        ...prevState,
        creator: creatorInfo.user_name,
      }));
  };
};

  useEffect(() => {
    if (hikeInfo) {
      setHikeDisplay({
        id: hikeInfo.id,
        title: hikeInfo.title,
        location: hikeInfo.location,
        comments: hikeInfo.comments,
      });
    };

    fetchTrailInfo();
    fetchCreatorName();

    const buttonMessage = fetchButtonMessage(hikeInfo.status, hikeType);
    const hikingDate = convertDate(hikeInfo.date);
    const hikingTime = convertTime(hikeInfo.time);

    setHikeDisplay((prevState) => ({
      ...prevState,
      buttonMessage: buttonMessage,
      date: hikingDate,
      time: hikingTime,
    }));
  }, []);

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
  }

  return <HikePost hike={hikeDisplay} trail={trail} onClick={handleClick} />;
}
