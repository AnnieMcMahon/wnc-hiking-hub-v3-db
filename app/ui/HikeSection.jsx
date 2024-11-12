import Hike from "./Hike";

export default function HikeSection({
  upcomingHikes,
  pastHikes,
  createdHikes
}) {
  return (
    <div className="hike-section">
      <h2>My Hikes - Coming Up</h2>
      <div>
        {upcomingHikes.map((hike) => (
          <Hike
            hikeType={createdHikes.includes(hike.id) ? "created" : "joined"}
            cancelled={hike.title.includes("CANCELLED") ? true : false}
            hikeInfo={hike}
            key={hike.id}
          />
        ))}
      </div>
      <h2>My Hikes - History</h2>
      <div>
        {pastHikes.map((hike) => (
          <Hike
            hikeType="history"
            hikeInfo={hike}
            key={hike.id}
            cancelled={hike.title.includes("CANCELLED") ? true : false}
          />
        ))}
      </div>
    </div>
  );
}
