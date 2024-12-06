"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { addTrail } from "@/app/api/data/data";
import TrailForm from "@/app/ui/forms/TrailForm";
import "./add-trail.css";

export default function AddTrail() {
  const router = useRouter();
  const { currentUser } = useGlobal();
  const { showModal, closeModal } = useModal();

  async function handleSubmit(newTrail) {
    if (currentUser.id == 1) {
      showModal("Demo", "Demo Mode - new trail cannot be saved.");
      router.push("/post-hike");
      return;
    }
    if (newTrail) {
      try {
        await addTrail(newTrail);
        showModal("Save Changes", "Changes have been saved successfully!", null, () => {
          closeModal();
        });
        router.push("/post-hike");
      } catch (error) {
        showModal(
          "Error adding the trail",
          "Make sure the trail is not already on the list.",
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
