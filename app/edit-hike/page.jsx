"use client";
import "./edit-hike.css";
import { useGlobal } from "../context/GlobalContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";

export default function EditHike() {
  const { hikes, hike, setHikes, setHike, showModal, closeModal } = useGlobal();
  const router = useRouter();
  // Initializing to no data prevents errors in preloading page
  let currentHikeInfo = hikes?.find((hikeData) => hikeData.id == hike) || {
    title: "",
    date: "",
    time: "",
    location: "",
    comments: ""
  }
  const [hikeInfo, setHikeInfo] = useState(currentHikeInfo);

  function handleSubmit(e) {
    e.preventDefault();
    if (
      hikeInfo.title &&
      hikeInfo.date &&
      hikeInfo.time &&
      hikeInfo.location &&
      hikeInfo.comments
    ) {
      setHike(hikeInfo);
      let hikeList = [...hikes];
      const hikeIndex = hikeList.findIndex((h) => h.id == hikeInfo.id);
      hikeList[hikeIndex] = hikeInfo;
      setHikes(hikeList);
      currentHikeInfo = hikeInfo
      showModal(
        "Save Changes",
        "Changes have been saved",
        null,
        () => {
          closeModal();
          router.push("/bio");
        });
    } else {
      showModal("Error", "Please complete all information");
    }
  }

  function handleDiscard() {
    setHikeInfo(currentHikeInfo);
    showModal(
      "Discard Changes",
      "Changes have been discarded",
      null,
      () => {
        closeModal();
        router.push("/bio");
      });
  }

  function handleCancel() {
    showModal(
      "Cancel Hike",
      "Press OK to cancel this hike (cannot be reversed)",
      () => handleNewCancellation()
    );
  }

  function handleNewCancellation() {
    // Add CANCELLED to the hike title and updates State and localStorage
    currentHikeInfo.title = `CANCELLED - ${hikeInfo.title}`;
    setHikeInfo(currentHikeInfo);
    //Update hike and hikes in state and localStorage
    setHike(currentHikeInfo);
    let hikeList = [...hikes];
    const hikeIndex = hikeList.findIndex((h) => h.id == hikeInfo.id);
    hikeList[hikeIndex] = hikeInfo;
    setHikes(hikeList);
    showModal(
      "Cancel Hike",
      "Hike has been cancelled",
      null,
      () => {
        closeModal();
        router.push("/bio");
      });
  }

  function handleChange(e) {
    setHikeInfo((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div id="edit-hike">
      <h1>Edit Hike</h1>
      <div id="form-area" className="text-box">
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="newTitle">Title: </label>
          <input
            type="text"
            name="title"
            id="newTitle"
            value={hikeInfo.title}
            onChange={(e) => handleChange(e)}
          />
          <br />

          <label htmlFor="newDate">Date: </label>
          <input
            type="date"
            name="date"
            id="newDate"
            value={hikeInfo.date}
            onChange={(e) => handleChange(e)}
          />
          <br />

          <label htmlFor="newTime"> Time: </label>
          <input
            type="time"
            name="time"
            id="newTime"
            value={hikeInfo.time}
            onChange={(e) => handleChange(e)}
          />
          <br />

          <label htmlFor="newLocation"> Location: </label>
          <input
            type="text"
            name="location"
            id="newLocation"
            value={hikeInfo.location}
            onChange={(e) => handleChange(e)}
          />
          <br />

          <label htmlFor="newComments">Comments: </label>
          <br />
          <textarea
            type="textarea"
            name="comments"
            id="newComments"
            value={hikeInfo.comments}
            data-gramm="false"
            onChange={(e) => handleChange(e)}
          />
          <br />
          <button type="submit" className="form-button">
            Save Changes
          </button>
          <button type="reset" onClick={handleDiscard} className="form-button">
            Discard Changes
          </button>
          <button type="button" onClick={handleCancel} className="form-button">
            Cancel Hike
          </button>
        </form>
        <Modal />
      </div>
    </div>
  );
}
