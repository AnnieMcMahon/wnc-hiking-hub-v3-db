export default function ChosenTrail({ trailSelected }) {
  if (trailSelected) {
    return (
      <div className="mini-form">
        <h4 className="text-sm font-bold">{trailSelected.trail_name}</h4>
        <p className="text-xs">{trailSelected.area_name}</p>
        <p className="text-xs">
          {trailSelected.difficulty_rating} * {trailSelected.length} mi *{" "}
          {trailSelected.elevation_gain} ft elev gain *{" "}
          {trailSelected.route_type}
        </p>
        <a
          href={trailSelected.trail_link}
          target="_blank"
          className="all-trails-link"
        >
          AllTrails Link
        </a>
      </div>
    );
  } else {
    return (
      <div className="mini-form">
        <h4 className="text-sm font-bold">Choose a trail</h4>
      </div>
    );
  }
}
