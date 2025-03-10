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
      <p className="text-xs mb-2 text-center">Maximum Participants: {hikeInfo.maxParticipants ? hikeInfo.maxParticipants : "10"}</p>
      <p className="text-xs mb-2">{hikeInfo.comments}</p>
      <hr />

      <div className="flex flex-row justify-between align-center flex-wrap">
      <Participants participants={participants}/>
      <Comments comments={comments}/>
      <AddComment hikeId={hikeInfo.id}/>
      </div>
      <hr />

      <div className="flex flex-row justify-between">
      <a href={trail.trail_link} target="_blank" className="all-trails-link">
        AllTrails Link
      </a>
      {hikeInfo.buttonMessage?.length > 0 && hikeInfo.buttonMessage !== "Hike Full" && (
        <button
          className="hike-post-button"
          name={hikeInfo.id}
          value={hikeInfo.buttonMessage}
          onClick={handleClick}
        >
          {hikeInfo.buttonMessage}
        </button>
      )}
      {hikeInfo.buttonMessage == "Hike Full" && (
        <p
          style={{ borderRadius: "6px" }}
          className="hike-post-button bg-gray-300"
        >
          {hikeInfo.buttonMessage}
        </p>
        
      )}
    </div>
    </div>
  );
}
