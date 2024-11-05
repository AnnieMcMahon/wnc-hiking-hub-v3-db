"use client";

import { useGlobal } from "../context/GlobalContext";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser, setCurrentUser, appUsers } = useGlobal();
  const pathname = usePathname();
  const router = useRouter();
  const [buttonMessage, setButtonMessage] = useState(
    currentUser.id == 1 ? "Log In" : "Log Out"
  );

  useEffect(() => {
    currentUser.id == 1
      ? setButtonMessage("Log In")
      : setButtonMessage("Log Out");
  }, [currentUser]);

  function handleClick() {
    if (buttonMessage == "Log In") {
      router.push("/login");
    } else {
      setCurrentUser(appUsers[0]);
      router.push("/");
    }
  }
  return (
    <div id="navbar">
      <Link
        className={`${pathname === "/" ? "active" : "inactive"}`}
        id="title"
        href="/"
      >
        WNC Hiking Hub
      </Link>
      <div className="links">
        <Link
          className={`${pathname === "/bio" ? "active" : "inactive"}`}
          href="/bio"
        >
          Bio
        </Link>
        <Link
          className={`${pathname === "/post-hike" ? "active" : "inactive"}`}
          href="/post-hike"
        >
          Post a Hike
        </Link>
        <Link
          className={`${pathname === "/join-hike" ? "active" : "inactive"}`}
          href="/join-hike"
        >
          Join a Hike
        </Link>
      </div>
      <button onClick={handleClick}>{buttonMessage}</button>
    </div>
  );
}
