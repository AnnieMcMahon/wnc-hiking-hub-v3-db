"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import BioSection from "@/app/ui/BioSection";
import HikeSection from "@/app/ui/HikeSection";
import "./bio.css";

export default function Bio() {
  const { currentUser, hikes } = useGlobal();
  const router = useRouter();
  const upcomingHikes = [];
  const pastHikes = [];
  const createdHikes = [];
  const currentDate = new Date().setHours(0, 0, 0, 0);

  hikes.forEach((hike) => {
    const hikeDate = new Date(hike.date).setHours(0, 0, 0, 0);
    if (currentUser.hikes.indexOf(hike.id) !== -1) {
      if (hikeDate < currentDate) {
        pastHikes.push(hike);
      } else {
        upcomingHikes.push(hike);
      }
      if (hike.creator == currentUser.id) {
        createdHikes.push(hike.id);
      }
    }
  });
  pastHikes.sort((a, b) => new Date(b.date) - new Date(a.date));
  upcomingHikes.sort((a, b) => new Date(a.date) - new Date(b.date));

  function handleClick() {
    router.push("/dashboard/edit-bio");
  }

  return (
    <div id="bio">
      <BioSection user={currentUser} onClick={handleClick}/>
      <HikeSection pastHikes={pastHikes} upcomingHikes={upcomingHikes} createdHikes={createdHikes}/>
    </div>
  );
};
