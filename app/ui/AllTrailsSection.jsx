import AllTrailsPost from "@/app/ui/AllTrailsPost";

export default function AllTrailsSection({
  area,
  difficulty,
  length,
  handleClick,
}) {

  return (
    <div className="hike-section">
      <h2>Trail Search Results</h2>
      {filteredList.map((trail) => (
        <AllTrailsPost
          hikeInfo={trail}
          key={trail.id}
          onClick={(trail) => handleClick(trail)}
        />
      ))}
    </div>
  );
}
