"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useGlobal } from "@/app/context/GlobalContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/app/api/data/data";
import { useState } from "react";

export function AddComment({ hikeId }) {
  const { currentUser, setTriggerRefresh } = useGlobal();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser.id == 1) {
      setErrorMessage("Demo Mode - comment cannot be saved.")
      return;
    }  

    const formData = new FormData(e.target);
    const commentText = formData.get("comment");
    if (commentText.length <= 2) {
      setErrorMessage("Your comment must be longer than two characters.");
      return;
    }  

    const commentInfo = {
      user_id: currentUser.id,
      hike_id: hikeId,
      comment_text: commentText
    };

    try {
      await addComment(commentInfo);
      setErrorMessage("Comment successfully added!");
      setTriggerRefresh(true);
    } catch (error) {
      setErrorMessage("Error adding comment.")
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="add-comment-button">
          Add Comment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="items-center">
            <Textarea
              id="comment"
              name="comment"
              placeholder="Type your comment here."
            />
          </div>
          <DialogFooter className="mx-auto">
            <Button type="submit">Submit Comment</Button>
          </DialogFooter>
        </form>
        <p>{errorMessage}</p>
      </DialogContent>
    </Dialog>
  );
}
