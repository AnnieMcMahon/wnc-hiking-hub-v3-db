"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTrailSearch } from "@/app/hooks/useTrailSearch";
import { addHike, addParticipant } from "@/app/api/data/data";
import ChosenTrail from "@/app/ui/components/ChosenTrail";
import SearchForm from "@/app/ui/forms/SearchForm";
import HikeForm from "@/app/ui/forms/HikeForm";
import TrailPost from "@/app/ui/components/TrailPost";
import { Button } from "@/components/ui/button";

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
      if (currentUser.id == 1) {
        showModal("Demo", "Demo Mode - new hike cannot be posted.");
        router.push(`/bio/${currentUser.id}`);
        return;
      }
      let newHike = newHikeInfo;
      newHike.creator_id = currentUser.id;
      newHike.trail_id = chosenTrail.id;
      newHike.status = "new";
      const newHikeAdded = await addHike(newHike);
      if (newHikeAdded) {
        const newHikeId = newHikeAdded[0].id;
        await addParticipant(newHike.creator_id, newHikeId);
      }
      router.push(`/bio/${currentUser.id}`);
    }
  };

  return (
    <div id="post-hike">
      <div className="content flex flex-row">
        <div className="text-box form-area w-[40%] md:w-[60%]">
          <h2>1. Search for a trail</h2>
          <SearchForm
            onSearch={(key, value) => updateSearchCriteria(key, value)}
          />
          <h2>2. Select a trail from the right column</h2>
          <ChosenTrail trailSelected={chosenTrail} />
          <h2>3. Fill out the hike information</h2>
          <HikeForm onSubmit={handleSubmit} />
        </div>
        <div className="hike-section w-[60%] md:w-[40%]">
          <div className="flex justify-between align-center mt-2">
            <h2>Trail Search Results</h2>
            <Button className="float-right" onClick={handleAddTrail}>
              Add New Trail
            </Button>
          </div>
          {filteredList.map((trail) => (
            <TrailPost
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
