"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { defaultUser, defaultHike } from "@/app/lib/defaultContent";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  //Initialize states with sample data
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [hike, setHike] = useState(defaultHike.id);
  
  // Store info in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("hike", JSON.stringify(hike));
  }, [hike]);
  
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);
  
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
