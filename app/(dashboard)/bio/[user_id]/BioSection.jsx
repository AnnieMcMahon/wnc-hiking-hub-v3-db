"use client";

import { DEFAULT_USER_NAME, DEFAULT_BIO, DEFAULT_AVATAR } from "@/app/lib/constants";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/app/context/GlobalContext";

export default function BioSection({ user = {}, onClick = () => {} }) {
  const { currentUser } = useGlobal();
  const avatar = user.avatar || DEFAULT_AVATAR;
  const userName = user.user_name || DEFAULT_USER_NAME;
  const bio = user.bio || DEFAULT_BIO;
  const showEditButton = user.id == currentUser.id;
  const handleClick = () => {onClick()};
  return (
    <div className="w-[95%] mx-2 md:w-[60%]">
        <div className={`flex items-center gap-4 m-2 md:m-4 ${showEditButton ? "justify-between" : "justify-left"}`}>
          <img className="h-8 md:h-16 w-8 md:w-16 border border-green-800 rounded-full" src={avatar} alt="avatar"/>
          <h1>{userName}</h1>
          {showEditButton &&
          <Button onClick={handleClick}>Edit Bio</Button>
        }
        </div>
        <div className="px-2 md:px-16">
          <h2>About Me</h2>
          <div className="text-box min-h-40">
            <p className="text-sm text-left pt-2">{bio}</p>
          </div>
        </div>
      </div>
  );
};