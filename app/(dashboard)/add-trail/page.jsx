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
      e.target.trail_name.value &&
      e.target.area_name.value &&
      e.target.difficulty_rating.value &&
      e.target.length.value &&
      e.target.elevation_gain.value &&
      e.target.route_type.value &&
      e.target.trail_link.value
    ) {
      const newTrailToAdd = {
        trail_name: e.target.trail_name.value,
        area_name: e.target.area_name.value,
        difficulty_rating: e.target.difficulty_rating.value,
        length: e.target.length.value,
        elevation_gain: e.target.elevation_gain.value,
        route_type: e.target.route_type.value,
        trail_link: e.target.trail_link.value
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

  function handleCancel() {
    router.push("/post-hike");
  }

  return (
    <div id="add-trail">
      <h1>Add New Trail</h1>
      <div id="form-area" className="text-box">
      <TrailForm onSubmit={handleSubmit} onClick={handleCancel} />
      <Modal />
      </div>
    </div>
  );
}