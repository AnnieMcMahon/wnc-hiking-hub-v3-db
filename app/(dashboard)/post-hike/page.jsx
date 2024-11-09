"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { allTrails } from "@/app/lib/seed";
import { filterTrailList } from "@/app/lib/utils";
import AllTrailsPost from "@/app/ui/AllTrailsPost";
import ChosenHike from "@/app/ui/ChosenHike";
import SearchForm from "@/app/ui/SearchForm";
import HikeForm from "@/app/ui/HikeForm";
import Modal from "@/app/ui/Modal";
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
  const [chosenHike, setChosenHike] = useState(null);
  const [filteredList, setFilteredList] = useState(allTrails);
  const [searchArea, setSearchArea] = useState("Anywhere in WNC");
  const [searchDifficulty, setSearchDifficulty] = useState("Any");
  const [searchLength, setSearchLength] = useState("Any length");

  function searchByArea(e) {
    setSearchArea(e.target.value);
    setFilteredList(filterTrailList(e.target.value, searchDifficulty, searchLength, allTrails));
  }

  function searchByDifficulty(e) {
    setSearchDifficulty(e.target.value);
    setFilteredList(filterTrailList(searchArea, e.target.value, searchLength, allTrails));
  };

  function searchByLength(e) {
    setSearchLength(e.target.value);
    setFilteredList(filterTrailList(searchArea, searchDifficulty, e.target.value, allTrails));
  };

  function handleClick(trail) {
    setChosenHike(trail);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newId = hikes[hikes.length - 1].id + 1;
    const newAllTrailsId = chosenHike ? chosenHike.id : -1;
    const newTitle = e.target.hikeTitle.value;
    const newDate = e.target.date.value;
    const newTime = e.target.time.value;
    const newLocation = e.target.location.value;
    const newComments = e.target.comments.value;
    if (
      newAllTrailsId > -1 &&
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
      };
      setHikes((prevHikes) => [...prevHikes, newHike]);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        hikes: [...prevUser.hikes, newHike.id],
      }));
      setAppUsers((prevAppUsers) =>
        prevAppUsers.map((user) =>
          user.id === currentUser.id
            ? { ...user, hikes: [...user.hikes, newHike.id] }
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
          <SearchForm searchByArea={searchByArea} searchByDifficulty={searchByDifficulty} searchByLength={searchByLength} />
          <h2>2. Select a trail from the right column</h2>
          <ChosenHike hikeSelected={chosenHike} />
          <h2>3. Fill out the hike information</h2>
          <HikeForm onSubmit={handleSubmit}/>
          <Modal />
        </div>
        <div className="hike-section">
          <h2>Trail Search Results</h2>
          {filteredList.map((trail) => (
            <AllTrailsPost
              hikeInfo={trail}
              key={trail.id}
              onClick={() => handleClick(trail)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
