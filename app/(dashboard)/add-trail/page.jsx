"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { addTrail } from "@/app/api/data";
import Modal from "@/app/ui/Modal";
import TrailForm from "@/app/ui/TrailForm";
import "./add-trail.css";

export default function AddTrail() {
  const { showModal, closeModal } = useGlobal();
  const router = useRouter();
  const [addedTrail, setAddedTrail] = useState(null);

  useEffect(() => {
    const addNewTrail = async () => {
      if (addedTrail && Object.keys(addedTrail).length > 0) {
      const newTrail = await addTrail(addedTrail);
      return newTrail;
      }
    };
    if (addedTrail && Object.keys(addedTrail).length > 0) {
      addNewTrail();
    }
  }, [addedTrail]);

  function handleSubmit(e) {
    e.preventDefault();
    if (
      e.target.trailName.value &&
      e.target.area_name.value &&
      e.target.difficulty.value &&
      e.target.length.value &&
      e.target.elevation.value &&
      e.target.type.value &&
      e.target.link.value
    ) {
      const newTrailToAdd = {
        name: e.target.trailName.value,
        area_name: e.target.area_name.value,
        difficulty: e.target.difficulty.value,
        length: e.target.length.value,
        elevation: e.target.elevation.value,
        type: e.target.type.value,
        link: e.target.link.value
      }
      setAddedTrail(newTrailToAdd);
      showModal(
        "Save Changes",
        "Changes have been saved",
        null,
        () => {
          closeModal();
          router.push("/post-hike");
        });
    } else {
      showModal("Error", "Please complete all information");
    }
  }

  return (
    <div id="add-trail">
      <h1>Add New Trail</h1>
      <div id="form-area" className="text-box">
      <TrailForm onSubmit={handleSubmit} />
      <Modal />
      </div>
    </div>
  );
}