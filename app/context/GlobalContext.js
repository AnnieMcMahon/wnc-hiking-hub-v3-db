"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { retrieveUser } from "@/app/api/authentication/auth";
import { fetchUserByEmail } from "@/app/api/data/data";

import { defaultUser } from "@/app/lib/defaultContent";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  //Initialize states with sample data
  const [currentUser, setCurrentUser] = useState(defaultUser);
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
