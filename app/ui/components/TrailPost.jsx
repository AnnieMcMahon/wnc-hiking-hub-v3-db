import { BLANK_TRAIL } from "@/app/lib/constants";

export default function TrailPost({
  trailInfo = BLANK_TRAIL,
  onClick = () => {},
}) {
  const handleClick = () => {
    onClick();
  };

  return (
    <div id="TrailPost" className="hike" onClick={handleClick}>
      <h4>{trailInfo.trail_name}</h4>
      <p>{trailInfo.area_name}</p>
      <p>
        {trailInfo.difficulty_rating} * {trailInfo.length} mi *{" "}
        {trailInfo.elevation_gain} ft elev gain * {trailInfo.route_type}
      </p>
      <a
        href={trailInfo.trail_link}
        target="_blank"
        onClick={(e) => e.stopPropagation()}
      >
        AllTrails Link
      </a>
    </div>
  );
}
