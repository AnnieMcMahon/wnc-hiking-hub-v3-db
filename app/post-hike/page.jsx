"use client";
import { useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import { useRouter } from "next/navigation";
import AllTrailsPost from "../components/AllTrailsPost";
import ChosenHike from "../components/ChosenHike";
import allTrails from "../assets/allTrails";
import Modal from "../components/Modal";
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
    filterTrailList(e.target.value, searchDifficulty, searchLength);
  }

  function searchByDifficulty(e) {
    setSearchDifficulty(e.target.value);
    filterTrailList(searchArea, e.target.value, searchLength);
  };

  function searchByLength(e) {
    setSearchLength(e.target.value);
    filterTrailList(searchArea, searchDifficulty, e.target.value);
  };

  function filterTrailList(area, difficulty, length) {
    let newList = allTrails;
    if (area !== "Anywhere in WNC") {
      newList = newList.filter(trail => trail.area == area)
    }
    if (difficulty !== "Any") {
      newList = newList.filter(trail => trail.difficulty == difficulty)
    }
    if (length !== "Any length") {
      newList = newList.filter(trail => 
        (length == "Short" && Number(trail.length) < 3) ||
        (length == "Long" && Number(trail.length > 6)) ||
          (length == "Medium" && Number(trail.length) >=3 && Number(trail.length) <= 6))
    }
    setFilteredList(newList);
  }

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
