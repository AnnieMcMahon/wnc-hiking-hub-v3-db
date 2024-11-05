"use client";
import "./edit-bio.css";
import { useRouter } from "next/navigation";
import { useGlobal } from "../context/GlobalContext";
import { useState } from "react";

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
    <div id="edit-bio">
      <h1>Edit Bio</h1>
      <div id="form-area" className="text-box">
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="newName">Name: </label>
          <input
            type="text"
            name="name"
            id="newName"
            value={bioInfo.name || ""}
            autoComplete="true"
            onChange={(e) => handleChange(e)}
          />
          <br />
          <label htmlFor="newAvatar">Avatar: </label>
          <input
            type="file"
            accept="image/*"
            name="avatar"
            id="newAvatar"
            onChange={(e) => handleAvatarChange(e)}
          />
          <br />
          <label htmlFor="newBio">Bio: </label>
          <textarea
            name="bio"
            id="newBio"
            value={bioInfo.bio || ""}
            data-gramm="false"
            onChange={(e) => handleChange(e)}
          />
          <br />
          <button type="submit" className="form-button">
            Save
          </button>
          <button onClick={handleClick} className="form-button">
            Discard
          </button>
        </form>
      </div>
    </div>
  );
}
export default EditBio;
