"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { retrieveUser } from "@/app/api/authentication/auth";
import { fetchUserByEmail } from "@/app/api/data/data";
import { DEFAULT_USER } from "@/app/lib/constants";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);
  const [hike, setHike] = useState();
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  
useEffect(() => {
  const fetchUser = async () => {
    const user = await retrieveUser();
    if (user) {
      const userInfo = await fetchUserByEmail(user.email);
      if (userInfo) {
        setCurrentUser(userInfo[0]);
      }
    }
  };
  fetchUser();
}, [currentUser]);
  
  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        hike,
        setHike,
        triggerRefresh,
        setTriggerRefresh
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
