"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateHike, fetchHikeById, fetchUserHikes } from "@/app/api/data";
import EditHikeForm from "@/app/ui/EditHikeForm";
import "./edit-hike.css";

export default function EditHike() {
  const { hike, currentUser } = useGlobal();
  const { showModal, closeModal } = useModal();
  const router = useRouter();
  const [hikeInfo, setHikeInfo] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    comments: "",
    status: "new"
  });
  const [currentHikeInfo, setCurrentHikeInfo] = useState(hikeInfo);

  useEffect(() => {
    const fetchHike = async () => {
      const fetchedHikeInfo = await fetchHikeById(hike);
      setHikeInfo(fetchedHikeInfo[0]);
      setCurrentHikeInfo(fetchedHikeInfo[0]);
      };
    fetchHike();
}, []);

useEffect(() => {
  const updateHikeWithNewInfo = async () => {
    if (currentHikeInfo.status == "cancelled" || currentHikeInfo.status == "updated") {
      await updateHike(currentHikeInfo);
      await fetchUserHikes(currentUser.id);
    }
  }
  updateHikeWithNewInfo();
}, [currentHikeInfo]);

  function handleSubmit(e) {
    e.preventDefault();
    if (
      hikeInfo.title &&
      hikeInfo.date &&
      hikeInfo.time &&
      hikeInfo.location &&
      hikeInfo.comments
    ) {
      setCurrentHikeInfo(hikeInfo);
      setCurrentHikeInfo((prevState) => ({
        ...prevState,
        status: "updated",
      }));
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
    const newTitle = `CANCELLED - ${hikeInfo.title}`
    setCurrentHikeInfo((prevState) => ({
      ...prevState,
      title: newTitle,
      status: "cancelled",
    }));
    setHikeInfo(currentHikeInfo);
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
      <EditHikeForm hikeInfo={hikeInfo} onSubmit={handleSubmit} onChange={handleChange} handleCancel={handleCancel} handleDiscard={handleDiscard}/>
      </div>
    </div>
  );
}
