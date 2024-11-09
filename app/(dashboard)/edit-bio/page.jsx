"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditBioForm from "@/app/ui/EditBioForm";
import "./edit-bio.css";

function EditBio() {
  const router = useRouter();
  const { currentUser, setCurrentUser, appUsers, setAppUsers } = useGlobal();
  const [bioInfo, setBioInfo] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
  });
  const [avatarFile, setAvatarFile] = useState();

  function handleSubmit(e) {
    e.preventDefault();
    const newInfo = currentUser;
    let newName = bioInfo.name;
    let newAvatar = avatarFile;
    let newBio = bioInfo.bio;
    if (newName) newInfo.name = newName;
    if (newAvatar) newInfo.avatar = newAvatar;
    if (newBio) newInfo.bio = newBio;
    //Update state and localStorage
    updateUser(newInfo);
    router.push("/bio");
  }

  function updateUser(userInfo) {
    //Update currentUser
    setCurrentUser(userInfo);
    //Update userList
    let userList = [...appUsers];
    const userIndex = userList.findIndex((user) => user.id == userInfo.id);
    userList[userIndex] = userInfo;
    setAppUsers(userList);
  }

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
    setAvatarFile(URL.createObjectURL(e.target.files[0]));
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
