"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateHike, fetchHikeById } from "@/app/api/data/data";
import { fetchUserHikes } from "@/app/hooks/fetchUserHikes";
import { BLANK_HIKE } from "@/app/lib/constants";
import EditHikeForm from "@/app/ui/forms/EditHikeForm";
import "./edit-hike.css";

export default function EditHike() {
  const { hike, currentUser } = useGlobal();
  const { showModal, closeModal } = useModal();
  const router = useRouter();
  const [hikeInfo, setHikeInfo] = useState(BLANK_HIKE);
  const [currentHikeInfo, setCurrentHikeInfo] = useState(hikeInfo);

  useEffect(() => {
    const fetchHike = async () => {
      try {
        const fetchedHikeInfo = await fetchHikeById(hike);
        setHikeInfo(fetchedHikeInfo[0]);
        setCurrentHikeInfo(fetchedHikeInfo[0]);
      } catch (error) {
        showModal("Error", error.message || "Error fetching hike information.");
      }
    };
    fetchHike();
}, []);

  async function handleSubmit(newHikeInfo) {
    if (currentUser.id == 1) {
      showModal("Demo", "Demo Mode - hike cannot be edited.");
      router.push("/bio");
      return;
    }  
      let updatedHike = newHikeInfo;
      updatedHike.id = currentHikeInfo.id;
      updatedHike.status = "updated";
      try {
        await updateHike(updatedHike);
        await fetchUserHikes(currentUser.id);
        setHikeInfo(updatedHike);
        setCurrentHikeInfo(updatedHike);
        showModal(
          "Save Changes",
          "Changes have been saved successfully!",
          null,
          () => {
            closeModal();
          });
        router.push("/bio");
      } catch (error) {
        showModal("Error", error.message || "Error updating hike.");
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
      });
      router.push("/bio");
  }

  function handleCancel() {
    showModal(
      "Cancel Hike",
      "Press OK to cancel this hike (cannot be reversed)",
      () => handleNewCancellation()
    );
  }

  async function handleNewCancellation() {
    if (currentUser.id == 1) {
      showModal("Demo", "Demo Mode - hike cannot be cancelled.");
      router.push("/bio");
      return;
    }  
    let updatedHike = hikeInfo;
    updatedHike.title = `CANCELLED - ${hikeInfo.title}`;
    updatedHike.status = "cancelled";
    try {
      await updateHike(updatedHike);
      await fetchUserHikes(currentUser.id);
      setHikeInfo(updatedHike);
      setCurrentHikeInfo(updatedHike);
      showModal(
        "Cancel Hike",
        "Hike has been cancelled",
        null,
        () => {
          closeModal();
        });
        router.push("/bio");
    } catch (error) {
      showModal("Error", error.message || "Error updating hike.");
    }
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
