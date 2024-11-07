"use client";
import { useGlobal } from "@/app/context/GlobalContext";
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
      router.push("/dashboard/login");
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
          className={`${pathname === "/dashboard/bio" ? "active" : "inactive"}`}
          href="/dashboard/bio"
        >
          Bio
        </Link>
        <Link
          className={`${pathname === "/dashboard/post-hike" ? "active" : "inactive"}`}
          href="/dashboard/post-hike"
        >
          Post a Hike
        </Link>
        <Link
          className={`${pathname === "/dashboard/join-hike" ? "active" : "inactive"}`}
          href="/dashboard/join-hike"
        >
          Join a Hike
        </Link>
      </div>
      <button onClick={handleClick}>{buttonMessage}</button>
    </div>
  );
}
