"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchUserHikes } from "@/app/hooks/fetchUserHikes";
import { fetchUserById } from "@/app/api/data/data";
import BioSection from "./BioSection";
import HikeSection from "./HikeSection";

export default function Bio() {
  const { currentUser, triggerRefresh, setTriggerRefresh } = useGlobal();
  const router = useRouter();
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [upcomingHikes, setUpcomingHikes] = useState([]);
  const [pastHikes, setPastHikes] = useState([]);
  const [createdHikes, setCreatedHikes] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user_id) {
        const userInfo = await fetchUserById(user_id);
        if (userInfo.length > 0) {
          setUser(userInfo[0]);
        }
      }
    };
    fetchUserData();
  }, [user_id]);

  useEffect(() => {
    const fetchHikes = async () => {
      if (currentUser) {
        const { upcomingHikes, pastHikes, createdHikes } = await fetchUserHikes(
          currentUser.id
        );
        setPastHikes(pastHikes);
        if (user_id == currentUser.id) {
        setUpcomingHikes(upcomingHikes);
        setCreatedHikes(createdHikes);
        }
      }
    };
    fetchHikes();
    setTriggerRefresh(false);
  }, [triggerRefresh]);

  function handleClick() {
    router.push("/edit-bio");
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex md:flex-row flex-col max-h-[90vh]">
      <BioSection user={user} onClick={handleClick} />
      <HikeSection
        pastHikes={pastHikes}
        upcomingHikes={upcomingHikes}
        createdHikes={createdHikes}
      />
    </div>
  );
}
