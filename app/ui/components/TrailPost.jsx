import { BLANK_TRAIL } from "@/app/lib/constants";

export default function TrailPost({
  trailInfo = BLANK_TRAIL,
  onClick = () => {},
}) {
  const handleClick = () => {
    onClick();
  };

  return (
    <div id="TrailPost" className="text-left bg-white mb-4 p-2 border border-green-800 hover:bg-green-500" onClick={handleClick}>
      <h4 className="text-sm font-bold">{trailInfo.trail_name}</h4>
      <p className="text-xs">{trailInfo.area_name}</p>
      <p className="text-xs">
        {trailInfo.difficulty_rating} * {trailInfo.length} mi *{" "}
        {trailInfo.elevation_gain} ft elev gain * {trailInfo.route_type}
      </p>
      <a
        href={trailInfo.trail_link}
        target="_blank"
        onClick={(e) => e.stopPropagation()}
        className="all-trails-link"
      >
        AllTrails Link
      </a>
    </div>
  );
}
