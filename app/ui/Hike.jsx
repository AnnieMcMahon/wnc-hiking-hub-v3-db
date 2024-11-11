"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { convertDate, convertTime } from "@/app/lib/utils";
import { fetchTrailById } from "../api/data";

export default function Hike({ hikeType, hikeInfo, cancelled }) {
  const { appUsers, setAppUsers, currentUser, setCurrentUser, setHike } =
    useGlobal();
  const router = useRouter();
  const [allTrailsInfo, setAllTrailsInfo] = useState({
    id: 0,
    name: "",
    area: "",
    difficulty: "",
    length: null,
    elevation: null,
    type: "",
    link: ""
  });

  useEffect(() => {
    const fetchTrailInfo = async () => {
      const trailInfo = await fetchTrailById(hikeInfo.id);
      setAllTrailsInfo(trailInfo[0]);
      return trailInfo;
    };
    fetchTrailInfo();
  }, []);

  let buttonMessage = "";
  if (!cancelled) {
    if (hikeType === "joined") {
      buttonMessage = "Opt Out";
    } else if (hikeType === "created") {
      buttonMessage = "Edit Hike";
    } else if (hikeType === "available") {
      buttonMessage = "Join Hike";
    }
  }

  const hikeCreator = appUsers.find((user) => user.id == hikeInfo.creator);
  const hikingDate = convertDate(hikeInfo.date);
  const hikingTime = convertTime(hikeInfo.time);

  function handleClick(e) {
    let newUserInfo = currentUser;
    switch (e.target.value) {
      case "Join Hike":
        newUserInfo.hikes.push(Number(e.target.name));
        updateUser(newUserInfo);
        break;
      case "Opt Out":
        const index = newUserInfo.hikes.indexOf(Number(e.target.name));
        newUserInfo.hikes.splice(index, 1);
        updateUser(newUserInfo);
        break;
      case "Edit Hike":
        setHike(e.target.name);
        router.push("/edit-hike");
        break;
      default:
        console.log("Different button");
    }
  }

  function updateUser(userInfo) {
    setCurrentUser(userInfo);
    let userList = [...appUsers];
    const userIndex = userList.findIndex((user) => user.id == userInfo.id);
    userList[userIndex] = userInfo;
    setAppUsers(userList);
  }

  return (
    <div className="hike">
      <h4>
        {hikeInfo.title}, with {hikeCreator ? hikeCreator.name : "Unknown"}
      </h4>
      <h5>{allTrailsInfo.area}</h5>
      <h5>
        {hikingDate}, {hikingTime}, {hikeInfo.location}
      </h5>
      <p>
        {allTrailsInfo.difficulty} * {allTrailsInfo.length} mi *{" "}
        {allTrailsInfo.elevation} ft * {allTrailsInfo.type}
      </p>
      <p>{hikeInfo.comments}</p>
      <a href={allTrailsInfo.link} target="_blank">
        All Trails Link
      </a>
      {buttonMessage.length > 0 && (
        <button
          className="hike-button"
          name={hikeInfo.id}
          value={buttonMessage}
          onClick={handleClick}
        >
          {buttonMessage}
        </button>
      )}
    </div>
  );
};
