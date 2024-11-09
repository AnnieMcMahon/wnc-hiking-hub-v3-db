export default function SearchForm({ searchByArea, searchByDifficulty, searchByLength }) {
  return (
    <form>
            <label htmlFor="area">Area: </label>
            <select name="area" id="area" onChange={searchByArea}>
              <option value="Anywhere in WNC">Anywhere in WNC</option>
              <option value="DuPont State Recreational Forest">
                DuPont State Recreational Forest
              </option>
              <option value="Pisgah National Forest">
                Pisgah National Forest
              </option>
              <option value="North Carolina Arboretum">
                North Carolina Arboretum
              </option>
              <option value="Nantahala Forest">Nantahala Forest</option>
            </select>
            <br />
            <label htmlFor="difficulty">Difficulty: </label>
            <select
              name="difficulty"
              id="difficulty"
              onChange={searchByDifficulty}
            >
              <option value="Any">Any</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Strenuous">Strenuous</option>
            </select>
            <label htmlFor="length"> Length: </label>
            <select name="length" id="length" onChange={searchByLength}>
              <option value="Any length">Any length</option>
              <option value="Short">Shorter than 3 miles</option>
              <option value="Medium">From 3 to 6 miles</option>
              <option value="Long">Longer than 6 miles</option>
            </select>
            <br />
          </form>
  );
};