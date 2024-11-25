"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTrailSearch } from "@/app/hooks/useTrailSearch";
import { handleAddHike } from "@/app/api/data/data";
import ChosenTrail from "@/app/ui/ChosenTrail";
import SearchForm from "@/app/ui/SearchForm";
import HikeForm from "@/app/ui/HikeForm";
import AllTrailsPost from "@/app/ui/AllTrailsPost";
import "./post-hike.css";

export default function PostHike() {
  const { currentUser } = useGlobal();
  const { showModal } = useModal();
  const router = useRouter();
  const { filteredList, updateSearchCriteria } = useTrailSearch();

  const [chosenTrail, setChosenTrail] = useState(null);

  const handleAddTrail = () => router.push("/add-trail");

  const handleSubmit = async (newHikeInfo) => {
    if (!chosenTrail) {
      showModal("Error", "Please choose a trail");
    } else {
      let newHike = newHikeInfo;
      newHike.creator_id = currentUser.id;
      newHike.trail_id = chosenTrail.id;
      newHike.status = "new";
      await handleAddHike(newHike);
      router.push("/bio");
    }
  };

  return (
    <div id="post-hike">
      <div className="content">
        <div id="form-area" className="text-box">
          <h2>1. Search for a trail</h2>
          <SearchForm
            onSearch={(key, value) => updateSearchCriteria(key, value)}
          />
          <h2>2. Select a trail from the right column</h2>
          <ChosenTrail trailSelected={chosenTrail} />
          <h2>3. Fill out the hike information</h2>
          <HikeForm onSubmit={handleSubmit} />
        </div>
        <div className="hike-section">
          <div className="section-header">
            <h2>Trail Search Results</h2>
            <button className="add-trail-button" onClick={handleAddTrail}>
              Add New Trail
            </button>
          </div>
          {filteredList.map((trail) => (
            <AllTrailsPost
              trailInfo={trail}
              key={trail.id}
              onClick={() => setChosenTrail(trail)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
