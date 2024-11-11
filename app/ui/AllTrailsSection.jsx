import { filterTrailList } from "@/app/lib/filterTrailList";
import AllTrailsPost from "@/app/ui/AllTrailsPost";

export default async function AllTrailsSection( { area, difficulty, length }) {
  let filteredList = await filterTrailList(area, difficulty, length);
  console.log(filteredList);

  function handleClick(e) {
    console.log(e.target.key);
  //   setChosenHike(trail);
  }

  return (
    <div className="hike-section">
      <h2>Trail Search Results</h2>
      {filteredList.map((trail) => (
        <AllTrailsPost
          hikeInfo={trail}
          key={trail.id}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
