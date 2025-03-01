"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";
import { useState } from "react";
import { updateUser, uploadAvatar } from "@/app/api/data/data";

import EditBioForm from "@/app/ui/forms/EditBioForm";
import "./edit-bio.css";

function EditBio() {
  const router = useRouter();
  const { showModal, closeModal } = useModal();
  const { currentUser, setCurrentUser } = useGlobal();
  const [bioInfo, setBioInfo] = useState({
    user_name: currentUser.user_name,
    bio: currentUser.bio
  });
  const [avatarFile, setAvatarFile] = useState();

  async function handleSubmit(newBioInfo) {
    if (currentUser.id == 1) {
      showModal("Demo", "Demo Mode - new bio cannot be saved.");
      router.push(`/bio/${currentUser.id}`);
      return;
    }
    let newName = currentUser.user_name == newBioInfo.user_name ? null : newBioInfo.user_name;
    let newBio = currentUser.bio == newBioInfo.bio ? null : newBioInfo.bio;

    // Set currentUser to new information and update database
    const newInfo = currentUser;
    if (newName || newBio || avatarFile) {
      if (avatarFile) {
        try {
          newInfo.avatar = await uploadAvatar(avatarFile, currentUser.id);
        } catch (error) {
          showModal(
            "Error",
            error.message || "Error uploading the avatar. Please try again.");
        }
      };
      if (newName) newInfo.user_name = newName;
      if (newBio) newInfo.bio = newBio;
      try {
        await updateUser(newInfo);
        setCurrentUser(newInfo);
        showModal("Save Changes", "Changes have been saved successfully!", null, () => {
          closeModal();
        });
        router.push(`/bio/${currentUser.id}`);
      } catch (error) {
        showModal(
          "Error",
          error.message || "Error updating the bio. Please try again."
        );
      }
    } 
  };

  function handleClick() {
    router.push(`/bio/${currentUser.id}`);
  }

  function handleChange(e) {
    setBioInfo((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  function handleAvatarChange(e) {
    setAvatarFile(e.target.files[0]);
  }

  return (
    <EditBioForm
      bioInfo={bioInfo}
      onSubmit={handleSubmit}
      onClick={handleClick}
      onChange={handleChange}
      handleAvatarChange={handleAvatarChange}
    />
  );
}
export default EditBio;
