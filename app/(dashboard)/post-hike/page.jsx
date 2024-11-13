"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { filterTrailList } from "@/app/api/data";
import { allTrails } from "@/app/lib/seed"; // Need to eliminate
import ChosenTrail from "@/app/ui/ChosenTrail";
import SearchForm from "@/app/ui/SearchForm";
import HikeForm from "@/app/ui/HikeForm";
import Modal from "@/app/ui/Modal";
import AllTrailsPost from "@/app/ui/AllTrailsPost";
import { ANY_AREA, ANY_LENGTH, ANY_DIFFICULTY } from "@/app/lib/constants";
import "./post-hike.css";

export default function PostHike() {
  const {
    hikes,
    setHikes,
    currentUser,
    setCurrentUser,
    setAppUsers,
    showModal,
  } = useGlobal();
  const router = useRouter();
  const [filteredList, setFilteredList] = useState(allTrails); //Need to change
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
    const newId = hikes[hikes.length - 1].id + 1;
    const newAllTrailsId = chosenTrail.id;
    console.log("AllTrails ID: ", chosenTrail.id);
    const newTitle = e.target.hikeTitle.value;
    const newDate = e.target.date.value;
    const newTime = e.target.time.value;
    const newLocation = e.target.location.value;
    const newComments = e.target.comments.value;
    if (
      newAllTrailsId &&
      newTitle &&
      newDate &&
      newTime &&
      newLocation &&
      newComments
    ) {
      const newHike = {
        id: newId,
        creator: currentUser.id,
        allTrailsId: newAllTrailsId,
        title: newTitle,
        date: newDate,
        time: newTime,
        location: newLocation,
        comments: newComments,
        status: "new"
      };
      console.log("AllTrailsID saved: ", newHike.allTrailsId);
      setHikes((prevHikes) => [...prevHikes, newHike]);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        user_hikes: [...prevUser.user_hikes, newHike.id],
      }));
      setAppUsers((prevAppUsers) =>
        prevAppUsers.map((user) =>
          user.id === currentUser.id
            ? { ...user, user_hikes: [...user.user_hikes, newHike.id] }
            : user
        )
      );
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
          <Modal />
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
