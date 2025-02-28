"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Participant from "@/app/ui/components/Participant";


export function Participants({participants}) {
  const message = participants.length +
    " " +
    "participant" +
    (participants.length !== 1 ? "s" : "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="participants">
          {message}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px] overflow-scroll" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Participants</DialogTitle>
        </DialogHeader>
        {participants?.map((participant) => (
          <Participant key={participant.user_id} participant={participant}/>
        ))}
      </DialogContent>
    </Dialog>
  );
}
