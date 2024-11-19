"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateUser, uploadAvatar } from "@/app/api/data";

import EditBioForm from "@/app/ui/EditBioForm";
import "./edit-bio.css";

function EditBio() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useGlobal();
  const { showModal } = useModal();
  const [bioInfo, setBioInfo] = useState({
    user_name: currentUser.user_name,
    bio: currentUser.bio
  });
  const [avatarFile, setAvatarFile] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    // Find out if there are any changes
    let newName = currentUser.user_name == bioInfo.user_name ? null : bioInfo.user_name;
    let newBio = currentUser.bio == bioInfo.bio ? null : bioInfo.bio;

    // Set currentUser to new information and update database
    const newInfo = currentUser;
    if (newName || newBio || avatarFile) {
      if (avatarFile) {
        try {
          newInfo.avatar = await uploadAvatar(avatarFile, currentUser.id);
        } catch (error) {
          console.error("Error updating avatar:", error);
          showModal("Error", "An error occurred while updating an avatar.");
        }
      }
      if (newName) newInfo.user_name = newName;
      if (newBio) newInfo.bio = newBio;
      try {
        await updateUser(newInfo);
        setCurrentUser(newInfo);
        router.push("/bio");
      } catch (error) {
        console.error("Error updating user:", error);
        showModal("Error", "An error occurred while updating a user.");
      }
    } 
  };

  function handleClick() {
    router.push("/edit-bio");
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
