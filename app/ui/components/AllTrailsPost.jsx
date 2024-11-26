export default function AllTrailsPost({trailInfo, onClick}) {
  return (
    <div id="AllTrailsPost" className="hike" onClick={onClick}>
      <h4>{trailInfo.trail_name}</h4>
      <p>{trailInfo.area_name}</p>
      <p>{trailInfo.difficulty_rating} * {trailInfo.length} mi * {trailInfo.elevation_gain} ft * {trailInfo.route_type}</p>
      <a href={trailInfo.trail_link} target="_blank" onClick={(e) => e.stopPropagation()}>AllTrails Link</a>
    </div>
  );
};
