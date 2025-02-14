"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_USER } from "@/app/lib/constants";
import { logout } from "@/app/api/authentication/auth";
import { Menubar } from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { currentUser, setCurrentUser } = useGlobal();
  const router = useRouter();
  const [buttonMessage, setButtonMessage] = useState(
    currentUser.id == 1 ? "Log In" : "Log Out"
  );

  useEffect(() => {
    currentUser.id == 1
      ? setButtonMessage("Log In")
      : setButtonMessage("Log Out");
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
  return (
    <Menubar className="flex justify-between md:px-4 px-2 py-5 bg-gray-100 w-full">
      < Link href="/" className="text-green-800 font-bold px-4" >
          <h1 className="hidden md:block">WNC Hiking Hub</h1>
          <h1 className="block md:hidden">WNC</h1>
      </Link>

      <NavigationMenu className="flex items-center md:space-x-8 space-x-2 mx-auto text-green-800">
        <Link href="/bio" legacyBehavior passHref>
          <NavigationMenuLink className="hover:text-green-400">
            Bio
          </NavigationMenuLink>
        </Link>
        <Link href="/post-hike" legacyBehavior passHref>
          <NavigationMenuLink className="hover:text-green-400">
            Post a Hike
          </NavigationMenuLink>
        </Link>
        <Link href="/join-hike" legacyBehavior passHref>
          <NavigationMenuLink className="hover:text-green-400">
            Join a Hike
          </NavigationMenuLink>
        </Link>
        <Link href="/about" legacyBehavior passHref>
          <NavigationMenuLink className="hover:text-green-400">
            About
          </NavigationMenuLink>
        </Link>
      </NavigationMenu>
      <Button onClick={handleClick}>{buttonMessage}</Button>
    </Menubar>
  );
}
