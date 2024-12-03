import HikeComponent from "@/app/ui/components/HikeComponent";

export default function HikeSection({
  upcomingHikes = [],
  pastHikes = [],
  createdHikes = []
}) {
  return (
    <div className="hike-section">
      <h2>My Hikes - Coming Up</h2>
      <div>
        {upcomingHikes?.map((hike) => (
          <HikeComponent
            hikeType={createdHikes?.includes(hike.id) ? "created" : "joined"}
            hikeInfo={hike}
            key={hike.id}
          />
        ))}
      </div>
      <h2>My Hikes - History</h2>
      <div>
        {pastHikes?.map((hike) => (
          <HikeComponent
            hikeType="history"
            hikeInfo={hike}
            key={hike.id}
          />
        ))}
      </div>
    </div>
  );
}
