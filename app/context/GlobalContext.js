"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { retrieveUser } from "@/app/api/authentication/auth";
import { fetchUserByEmail } from "@/app/api/data/data";
import { DEFAULT_USER } from "../lib/constants";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);
  const [hike, setHike] = useState();
  
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
}, []);
  
  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        hike,
        setHike,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
