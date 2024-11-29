export default function ChosenTrail({ trailSelected }) {
  if (trailSelected) {
    return (
      <div>
        <div id="chosen-trail" className="hike">
          <h4>{trailSelected.trail_name}</h4>
          <p>{trailSelected.area_name}</p>
          <p>
            {trailSelected.difficulty_rating} * {trailSelected.length} mi *{" "}
            {trailSelected.elevation_gain} ft * {trailSelected.route_type}
          </p>
          <a
            href={trailSelected.trail_link}
            target="_blank"
          >
            AllTrails Link
          </a>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="hike" id="chosen-trail-placeholder">
        <h2>Choose a trail</h2>
        </div>
      </div>
    );
  }
}
