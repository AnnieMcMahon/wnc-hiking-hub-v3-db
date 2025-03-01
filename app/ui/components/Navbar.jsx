"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_USER } from "@/app/lib/constants";
import { logout } from "@/app/api/authentication/auth";
import { Menubar } from "@/components/ui/menubar";
import { NavigationMenu, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { currentUser, setCurrentUser } = useGlobal();
  const router = useRouter();
  const pathname = usePathname();
  const [buttonMessage, setButtonMessage] = useState(
    currentUser.id == 1 ? "Log In" : "Log Out"
  );

  useEffect(() => {
    setButtonMessage(currentUser.id == 1 ? "Log In" : "Log Out");
  }, [currentUser]);

  async function handleClick() {
    if (buttonMessage == "Log In") {
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
    <Menubar className="flex justify-between md:px-4 px-2 py-5 bg-gray-100 w-full">
      <Link href="/" className={`px-4 hover:text-green-400 ${pathname === "/" ? "text-green-600" : "text-green-800"}`}>
        <h1 className="hidden md:block">WNC Hiking Hub</h1>
        <h1 className="block md:hidden">WNC</h1>
      </Link>

      <NavigationMenu className="flex items-center md:space-x-8 space-x-2 mx-auto">
        {menuLinks.map((link) => (
          <NavigationMenuLink
            href={link.path} className={`hover:text-green-400 ${pathname === link.path ? "text-green-600 font-bold" : "text-green-800"}`} key={link.key}
          >
            {link.name}
          </NavigationMenuLink>
        ))}
      </NavigationMenu>

      <Button onClick={handleClick}>{buttonMessage}</Button>
    </Menubar>
  );
}
