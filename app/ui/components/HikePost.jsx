import { BLANK_HIKE_INFO } from "@/app/lib/constants";
import { BLANK_TRAIL } from "@/app/lib/constants";
import { AddComment } from "@/app/ui/components/AddComment";
import { Comments } from "@/app/ui/components/Comments";
import { Participants } from "@/app/ui/components/Participants";

export default function HikePost({
  hikeInfo = BLANK_HIKE_INFO,
  trail = BLANK_TRAIL,
  comments = {
    commentsMessage: "0 comments",
    commentsTable: []
  },
  participants = {
    participantsMessage: "0 comments",
    participantsTable: []
  },
  onClick = () => {},
}) {

  const handleClick = (e) => {
    onClick(e.target.value, e.target.name);
  };

  return (
    <div className="text-left bg-white mb-4 p-2 border border-green-800 rounded-sm">
      <h4 className="text-sm font-bold my-2">
        {hikeInfo.title}, with {hikeInfo.creator}
      </h4>
      <hr />
      <h5 className="text-xs my-2 text-center">{trail.area_name}</h5>
      <h5 className="text-xs mb-2 text-center">
        {hikeInfo.date}, {hikeInfo.time} <br/> {hikeInfo.location}
      </h5>
      <p className="text-xs mb-2 text-center">
        {trail.difficulty_rating} * {trail.length} mi * {trail.elevation_gain}{" "}
        ft elev gain * {trail.route_type}
      </p>
      <p className="text-xs mb-2">{hikeInfo.comments}</p>
      <hr />
      <Participants participants={participants}/>
      <Comments comments={comments}/>
      <AddComment hikeId={hikeInfo.id}/>
      <hr className="mb-2"/>
      <a href={trail.trail_link} target="_blank" className="text-green-800 hover:text-green-500">
        AllTrails Link
      </a>
      {hikeInfo.buttonMessage?.length > 0 && (
        <button
          className="py-0 sm-py-1 sm-w-20 w-16 float-right text-xs"
          name={hikeInfo.id}
          value={hikeInfo.buttonMessage}
          onClick={handleClick}
        >
          {hikeInfo.buttonMessage}
        </button>
      )}
    </div>
  );
}
