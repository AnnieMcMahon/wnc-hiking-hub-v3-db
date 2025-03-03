"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_USER } from "@/app/lib/constants";
import { logout } from "@/app/api/authentication/auth";

export default function Navbar() {
  const { currentUser, setCurrentUser } = useGlobal();
  const router = useRouter();
  const pathname = usePathname();
  const [buttonMessage, setButtonMessage] = useState(
    currentUser.id == 1 ? "Log In / Sign Up" : "Log Out"
  );

  useEffect(() => {
    setButtonMessage(currentUser.id == 1 ? "Log In / Sign Up" : "Log Out");
  }, [currentUser]);

  async function handleClick() {
    if (buttonMessage == "Log In / Sign Up") {
      router.push("/login");
    } else {
      setCurrentUser(DEFAULT_USER);
      await logout();
      router.push("/");
    }
  }

  const menuLinks = [
    {key: 1, name: "Bio", path: `/bio/${currentUser.id}`},
    {key: 2, name: "Post a Hike", path: "/post-hike"},
    {key: 3, name: "Join a Hike", path: "/join-hike"},
    {key: 4, name: "About", path: "/about"},
  ]

  return (
    <div className="flex justify-between p-2 bg-gray-100 w-full">
      <Link href="/" className={`px-4 hover:text-green-400 ${pathname === "/" ? "text-green-600" : "text-green-800"}`}>
        <h1 className="hidden md:block">WNC Hiking Hub</h1>
        <h1 className="block md:hidden">WNC</h1>
      </Link>

      <div className="flex items-center md:space-x-8 space-x-2 mx-auto">
        {menuLinks.map((link) => (
          <Link
            href={link.path} className={`hover:text-green-400 ${pathname === link.path ? "text-green-600 font-bold" : "text-green-800"}`} key={link.key}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <button className="form-button" onClick={handleClick}>{buttonMessage}</button>
    </div>
  );
}
