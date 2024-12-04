"use client";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { addTrail } from "@/app/api/data/data";
import TrailForm from "@/app/ui/forms/TrailForm";
import "./add-trail.css";

export default function AddTrail() {
  const router = useRouter();
  const { showModal, closeModal } = useModal();

  async function handleSubmit(newTrail) {
    if (newTrail) {
      try {
        await addTrail(newTrail);
        showModal("Save Changes", "Changes have been saved successfully!", null, () => {
          closeModal();
        });
        router.push("/post-hike");
      } catch (error) {
        showModal(
          "Error",
          error.message || "An unexpected error occurred while adding the trail.",
          null,
          () => {
            closeModal();
          }
        );
      }
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
      </div>
    </div>
  );
}
