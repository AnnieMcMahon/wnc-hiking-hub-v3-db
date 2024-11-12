"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BioSection from "@/app/ui/BioSection";
import HikeSection from "@/app/ui/HikeSection";
import "./bio.css";

export default function Bio() {
  const { currentUser, hikes } = useGlobal();
  const router = useRouter();
  const [upcomingHikes, setUpcomingHikes] = useState([]);
  const [pastHikes, setPastHikes] = useState([]);
  const [createdHikes, setCreatedHikes] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    const sortedPastHikes = [];
    const sortedUpcomingHikes = [];
    const createdHikesList = [];
  
    hikes.forEach((hike) => {
      const hikeDate = new Date(hike.date).setHours(0, 0, 0, 0);
      if (currentUser.hikes.includes(hike.id)) {
        if (hikeDate < currentDate) {
          sortedPastHikes.push(hike);
        } else {
          sortedUpcomingHikes.push(hike);
        }
        if (hike.creator === currentUser.id) {
          createdHikesList.push(hike.id);
        }
      }
    });
    sortedPastHikes.sort((a, b) => new Date(b.date) - new Date(a.date));
    sortedUpcomingHikes.sort((a, b) => new Date(a.date) - new Date(b.date));
    setPastHikes(sortedPastHikes);
    setUpcomingHikes(sortedUpcomingHikes);
    setCreatedHikes(createdHikesList);
  }, [hikes, currentUser]);

  function handleClick() {
    router.push("/edit-bio");
  }

  return (
    <div id="bio">
      <BioSection user={currentUser} onClick={handleClick}/>
      <HikeSection pastHikes={pastHikes} upcomingHikes={upcomingHikes} createdHikes={createdHikes}/>
    </div>
  );
};
