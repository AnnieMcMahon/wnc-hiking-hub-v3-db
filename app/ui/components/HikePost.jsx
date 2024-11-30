import { BLANK_HIKE_INFO } from "@/app/lib/constants";
import { BLANK_TRAIL } from "@/app/lib/constants";

export default function HikePost({
  hike = { BLANK_HIKE_INFO },
  trail = { BLANK_TRAIL },
  onClick = () => {},
}) {

  const handleClick = (e) => {
    onClick(e.target.value, e.target.name);
  };

  return (
    <div className="hike">
      <h4>
        {hike.title}, with {hike.creator}
      </h4>
      <h5>{trail.area_name}</h5>
      <h5>
        {hike.date}, {hike.time}, {hike.location}
      </h5>
      <p>
        {trail.difficulty_rating} * {trail.length} mi * {trail.elevation_gain}{" "}
        ft * {trail.route_type}
      </p>
      <p>{hike.comments}</p>
      <a href={trail.trail_link} target="_blank">
        AllTrails Link
      </a>
      {hike.buttonMessage?.length > 0 && (
        <button
          className="hike-button"
          name={hike.id}
          value={hike.buttonMessage}
          onClick={handleClick}
        >
          {hike.buttonMessage}
        </button>
      )}
    </div>
  );
}
