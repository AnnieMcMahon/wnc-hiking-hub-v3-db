"use client";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { addTrail } from "@/app/api/data/data";
import TrailForm from "@/app/ui/TrailForm";
import "./add-trail.css";

export default function AddTrail() {
  const router = useRouter();
  const { showModal, closeModal } = useModal();
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

  function handleSubmit(newTrailToAdd) {
    setAddedTrail(newTrailToAdd);
    showModal("Save Changes", "Changes have been saved", null, () => {
      closeModal();
    });
    router.push("/post-hike");
  }

  function handleCancel() {
    router.push("/post-hike");
  }

  return (
    <div id="add-trail">
      <h1>Add New Trail</h1>
      <div id="form-area" className="text-box">
        <TrailForm onSubmit={handleSubmit} onClick={handleCancel} />
      </div>
    </div>
  );
}
