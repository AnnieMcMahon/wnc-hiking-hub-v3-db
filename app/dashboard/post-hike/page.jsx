"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { allTrails } from "@/app/lib/seed";
import { filterTrailList } from "@/app/lib/utils";
import AllTrailsPost from "@/app/ui/AllTrailsPost";
import ChosenHike from "@/app/ui/ChosenHike";
import Modal from "@/app/ui/Modal";
import "./post-hike.css";

function PostHike() {
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
      router.push("/dashboard/bio");
    } else {
      showModal("Error", "Please fill out all the information");
    }
  }

  return (
    <div id="post-hike">
      <div className="content">
        <div id="form-area" className="text-box">
          <h2>1. Search for a trail</h2>
          <form>
            <label htmlFor="area">Area: </label>
            <select name="area" id="area" onChange={(e) => searchByArea(e)}>
              <option value="Anywhere in WNC">Anywhere in WNC</option>
              <option value="DuPont State Recreational Forest">
                DuPont State Recreational Forest
              </option>
              <option value="Pisgah National Forest">
                Pisgah National Forest
              </option>
              <option value="North Carolina Arboretum">
                North Carolina Arboretum
              </option>
              <option value="Nantahala Forest">Nantahala Forest</option>
            </select>
            <br />
            <label htmlFor="difficulty">Difficulty: </label>
            <select
              name="difficulty"
              id="difficulty"
              onChange={(e) => searchByDifficulty(e)}
            >
              <option value="Any">Any</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Strenuous">Strenuous</option>
            </select>
            <label htmlFor="length"> Length: </label>
            <select name="length" id="length" onChange={(e) => searchByLength(e)}>
              <option value="Any length">Any length</option>
              <option value="Short">Shorter than 3 miles</option>
              <option value="Medium">From 3 to 6 miles</option>
              <option value="Long">Longer than 6 miles</option>
            </select>
            <br />
          </form>
          <h2>2. Select a trail from the right column</h2>
          <ChosenHike hikeSelected={chosenHike} />
          <h2>3. Fill out the hike information</h2>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="hikeTitle">Title: </label>
            <input type="text" name="hikeTitle" id="hikeTitle" />
            <br />
            <label htmlFor="date">Date: </label>
            <input type="date" name="date" id="date" />
            <label htmlFor="time"> Time: </label>
            <input type="time" name="time" id="time" />
            <br />
            <label htmlFor="location"> Location: </label>
            <input type="text" name="location" id="location" />
            <br />
            <label htmlFor="comments">Comments: </label>
            <br />
            <textarea
              type="textarea"
              name="comments"
              id="comments"
              data-gramm="false"
            />
            <br />
            <button type="submit" className="form-button">
              Submit Form
            </button>
            <Modal />
          </form>
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
}
export default PostHike;
