"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchUserHikes } from "@/app/api/data/data";
import BioSection from "./BioSection";
import HikeSection from "./HikeSection";
import "./bio.css";

export default function Bio() {
  const { currentUser } = useGlobal();
  const router = useRouter();
  const [upcomingHikes, setUpcomingHikes] = useState([]);
  const [pastHikes, setPastHikes] = useState([]);
  const [createdHikes, setCreatedHikes] = useState([]);

  useEffect(() => {
    const fetchHikes = async () => {
      if (currentUser) {
        const { upcomingHikes, pastHikes, createdHikes } = await fetchUserHikes(
          currentUser.id
        );
        setUpcomingHikes(upcomingHikes);
        setPastHikes(pastHikes);
        setCreatedHikes(createdHikes);
      }
    };
    fetchHikes();
  }, []);

  function handleClick() {
    router.push("/edit-bio");
  }

  return (
    <div id="bio">
      <BioSection user={currentUser} onClick={handleClick} />
      <HikeSection
        pastHikes={pastHikes}
        upcomingHikes={upcomingHikes}
        createdHikes={createdHikes}
      />
    </div>
  );
}
