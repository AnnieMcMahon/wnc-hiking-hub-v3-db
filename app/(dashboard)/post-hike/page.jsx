"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { filterTrailList, handleAddHike } from "@/app/api/data";
import { defaultTrail } from "@/app/lib/defaultContent";
import ChosenTrail from "@/app/ui/ChosenTrail";
import SearchForm from "@/app/ui/SearchForm";
import HikeForm from "@/app/ui/HikeForm";
import AllTrailsPost from "@/app/ui/AllTrailsPost";
import { ANY_AREA, ANY_LENGTH, ANY_DIFFICULTY } from "@/app/lib/constants";
import "./post-hike.css";

export default function PostHike() {
  const { currentUser } = useGlobal();
  const { showModal } = useModal();
  const router = useRouter();
  const [filteredList, setFilteredList] = useState([defaultTrail]);
  const [chosenTrail, setChosenTrail] = useState(null);
  const [searchArea, setSearchArea] = useState(ANY_AREA);
  const [searchDifficulty, setSearchDifficulty] = useState(ANY_DIFFICULTY);
  const [searchLength, setSearchLength] = useState(ANY_LENGTH);

  useEffect(() => {
    const fetchNewList = async () => {
      const newList = await filterTrailList(
        searchArea,
        searchDifficulty,
        searchLength
      );
      setFilteredList(newList);
      return newList;
    };
    fetchNewList();
  }, [searchArea, searchDifficulty, searchLength]);

  function searchByArea(e) {
    setSearchArea(e.target.value);
  }

  function searchByDifficulty(e) {
    setSearchDifficulty(e.target.value);
  }

  function searchByLength(e) {
    setSearchLength(e.target.value);
  }

  function handleClick(trail) {
    setChosenTrail(trail);
  }

  function handleAddTrail() {
    router.push("/add-trail");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newTrailId = chosenTrail ? chosenTrail.id : null;
    const newTitle = e.target.hikeTitle.value;
    const newDate = e.target.date.value;
    const newTime = e.target.time.value;
    const newLocation = e.target.location.value;
    const newComments = e.target.comments.value;
    if (
      newTrailId &&
      newTitle &&
      newDate &&
      newTime &&
      newLocation &&
      newComments
    ) {
      const newHike = {
        creator_id: currentUser.id,
        trail_id: newTrailId,
        title: newTitle,
        date: newDate,
        time: newTime,
        location: newLocation,
        comments: newComments,
        status: "new"
      };
      try {
        handleAddHike(newHike);
      } catch (error) {
        console.error("Error adding new hike:", error);
        showModal("Error", "An error occurred while adding a new hike.");
      }
      router.push("/bio");
    } else {
      showModal("Error", "Please fill out all the information");
    }
  }

  return (
    <div id="post-hike">
      <div className="content">
        <div id="form-area" className="text-box">
          <h2>1. Search for a trail</h2>
          <SearchForm
            searchByArea={searchByArea}
            searchByDifficulty={searchByDifficulty}
            searchByLength={searchByLength}
          />
          <h2>2. Select a trail from the right column</h2>
          <ChosenTrail trailSelected={chosenTrail} />
          <h2>3. Fill out the hike information</h2>
          <HikeForm onSubmit={handleSubmit} />
        </div>
        <div className="hike-section">
          <div className="section-header">
          <h2>Trail Search Results</h2>
          <button className="add-trail-button" onClick={handleAddTrail}>Add New Trail</button>
          </div>
          {filteredList.map((trail) => (
            <AllTrailsPost
              trailInfo={trail}
              key={trail.id}
              onClick={() => handleClick(trail)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
