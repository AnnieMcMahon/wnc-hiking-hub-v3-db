"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/app/ui/Modal";
import EditHikeForm from "@/app/ui/EditHikeForm";
import "./edit-hike.css";

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
          router.push("/dashboard/bio");
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
        router.push("/dashboard/bio");
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
        router.push("/dashboard/bio");
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
      <EditHikeForm hikeInfo={hikeInfo} onSubmit={handleSubmit} onChange={handleChange} handleCancel={handleCancel} handleDiscard={handleDiscard}/>
      <Modal />
      </div>
    </div>
  );
}
