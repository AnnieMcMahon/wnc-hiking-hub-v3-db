"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/app/api/data/data";
import { useGlobal } from "@/app/context/GlobalContext";
import { useState } from "react";

export function AddComment({ hikeId }) {
  const { currentUser } = useGlobal();
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
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Add your comment here. Click Submit Comment when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              id="comment"
              name="comment"
              className="col-span-3"
              placeholder="Type your comment here."
            />
          </div>
          <DialogFooter>
            <Button type="submit">Submit Comment</Button>
          </DialogFooter>
        </form>
        <p>{errorMessage}</p>
      </DialogContent>
    </Dialog>
  );
}
