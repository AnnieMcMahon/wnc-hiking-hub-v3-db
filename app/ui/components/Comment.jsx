"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUserById } from "@/app/api/data/data";
import { useState, useEffect } from "react";
import { convertDate } from "@/app/lib/utils";

export default function Comment({comment}) {
  const [commentData, setCommentData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await fetchUserById(comment.user_id);
      const user_name = userInfo[0]?.user_name ? userInfo[0].user_name : "unknown";
      const avatar = userInfo[0]?.avatar ? userInfo[0].avatar : "newUser.png"
      const date = convertDate(comment.created_at);
      setCommentData({
        user_name: user_name,
        avatar: avatar,
        date: date,
        message: comment.comment_text,
      })
    }
    fetchData();
  }, [comment.user_id]);

  return (
    <div className="container border border-gray-400 p-2">
      <div className="flex flex-row gap-4">
        <Avatar className="w-4 h-4">
          <AvatarImage src={commentData.avatar} />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <div className="flex justify-between w-full text-xs">
          <div>{commentData.user_name}</div>
          <div className="text-gray-500">{commentData.date}</div>
        </div>
      </div>
      <div className="text-sm text-left">{commentData.message}</div>
    </div>
  );
}
