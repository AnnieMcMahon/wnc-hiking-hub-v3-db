export default function AllTrailsPost({trailInfo, onClick}) {
  return (
    <div id="AllTrailsPost" className="hike" onClick={onClick}>
      <h4>{trailInfo.name}</h4>
      <p>{trailInfo.area_name}</p>
      <p>{trailInfo.difficulty} * {trailInfo.length} mi * {trailInfo.elevation} ft * {trailInfo.type}</p>
      <a href={trailInfo.link} target="_blank" onClick={(e) => e.stopPropagation()}>All Trails Link</a>
    </div>
  );
};
