"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { retrieveUser } from "@/app/api/authentication/auth";
import { fetchUserByEmail } from "@/app/api/data/data";
import { DEFAULT_USER } from "@/app/lib/constants";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);
  const [hike, setHike] = useState();
  const [loading, setLoading] = useState(true);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); 
      try {
        const user = await retrieveUser();
        if (user) {
          console.log("🔄 User session retrieved:", user);
          const userInfo = await fetchUserByEmail(user.email);
          if (userInfo?.length > 0) {
            setCurrentUser(userInfo[0]);
          }
        } else {
          console.warn("⚠️ No user session found in GlobalContext");
          setCurrentUser(DEFAULT_USER);
        }
      } catch (error) {
        console.error("❌ Error retrieving user:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, [triggerRefresh]);

  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        hike,
        setHike,
        loading,
        triggerRefresh,
        setTriggerRefresh,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
