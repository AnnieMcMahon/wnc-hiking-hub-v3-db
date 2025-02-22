import { BLANK_HIKE_INFO } from "@/app/lib/constants";
import { BLANK_TRAIL } from "@/app/lib/constants";
import { AddComment } from "@/app/ui/components/AddComment";
import { Comments } from "@/app/ui/components/Comments";

export default function HikePost({
  hikeInfo = BLANK_HIKE_INFO,
  trail = BLANK_TRAIL,
  comments = {
    commentsMessage: "0 comments",
    commentsTable: []
  },
  onClick = () => {},
}) {

  const handleClick = (e) => {
    onClick(e.target.value, e.target.name);
  };

  return (
    <div className="hike">
      <h4>
        {hikeInfo.title}, with {hikeInfo.creator}
      </h4>
      <h5>{trail.area_name}</h5>
      <h5>
        {hikeInfo.date}, {hikeInfo.time}, {hikeInfo.location}
      </h5>
      <p>
        {trail.difficulty_rating} * {trail.length} mi * {trail.elevation_gain}{" "}
        ft elev gain * {trail.route_type}
      </p>
      <p>{hikeInfo.comments}</p>
      <button
        className="party-list"
        name={hikeInfo.id}
        value="participants"
        onClick={handleClick}
      >
        {hikeInfo.participantsMessage}
      </button>
      <Comments comments={comments}/>
      <AddComment hikeId={hikeInfo.id}/>
      <br/>
      <a href={trail.trail_link} target="_blank" className="text-green-800">
        AllTrails Link
      </a>
      {hikeInfo.buttonMessage?.length > 0 && (
        <button
          className="hike-button"
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
