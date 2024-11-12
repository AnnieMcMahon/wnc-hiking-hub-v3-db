import { ANY_AREA, ANY_DIFFICULTY, ANY_LENGTH } from "@/app/lib/constants";

export default function SearchForm({
  searchByArea,
  searchByDifficulty,
  searchByLength,
}) {
  return (
    <form>
      <label htmlFor="area_name">Area Name: </label>
      <select name="area_name" id="area_name" onChange={searchByArea}>
        <option value={ANY_AREA}>{ANY_AREA}</option>
        <option value="DuPont State Recreational Forest">
          DuPont State Recreational Forest
        </option>
        <option value="Pisgah National Forest">Pisgah National Forest</option>
        <option value="North Carolina Arboretum">
          North Carolina Arboretum
        </option>
        <option value="Nantahala Forest">Nantahala Forest</option>
      </select>
      <br />
      <label htmlFor="difficulty">Difficulty: </label>
      <select name="difficulty" id="difficulty" onChange={searchByDifficulty}>
        <option value={ANY_DIFFICULTY}>{ANY_DIFFICULTY}</option>
        <option value="Easy">Easy</option>
        <option value="Moderate">Moderate</option>
        <option value="Strenuous">Strenuous</option>
      </select>
      <label htmlFor="length"> Length: </label>
      <select name="length" id="length" onChange={searchByLength}>
        <option value={ANY_LENGTH}>{ANY_LENGTH}</option>
        <option value="Short">Shorter than 3 miles</option>
        <option value="Medium">From 3 to 6 miles</option>
        <option value="Long">Longer than 6 miles</option>
      </select>
      <br />
    </form>
  );
}
