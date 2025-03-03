export default function ChosenTrail({ trailSelected }) {
  if (trailSelected) {
    return (
      <div className="text-left bg-white mb-4 p-2 border border-gray-300 w-[70%] ">
        <h4 className="text-sm font-bold">{trailSelected.trail_name}</h4>
        <p className="text-xs">{trailSelected.area_name}</p>
        <p className="text-xs">
          {trailSelected.difficulty_rating} * {trailSelected.length} mi *{" "}
          {trailSelected.elevation_gain} ft elev gain *{" "}
          {trailSelected.route_type}
        </p>
        <a
          className="text-green-800 hover:text-green-400"
          href={trailSelected.trail_link}
          target="_blank"
        >
          AllTrails Link
        </a>
      </div>
    );
  } else {
    return (
      <div className="text-left bg-white mb-4 p-2 w-[70%] border border-gray-300">
        <h4 className="text-sm font-bold">Choose a trail</h4>
      </div>
    );
  }
}
