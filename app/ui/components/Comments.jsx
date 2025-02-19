"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Comment from "@/app/ui/components/Comment";


export function Comments({comments}) {
  const message = comments.length +
    " " +
    "comment" +
    (comments.length !== 1 ? "s" : "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="comments">
          {message}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px] overflow-scroll" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        {comments?.map((comment) => (
          <Comment key={comment.id} comment={comment}/>
        ))}
      </DialogContent>
    </Dialog>
  );
}
