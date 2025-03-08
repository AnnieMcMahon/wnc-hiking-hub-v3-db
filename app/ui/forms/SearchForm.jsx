import { AREAS, DIFFICULTIES, LENGTHS, ANY_AREA, ANY_DIFFICULTY, ANY_LENGTH } from "@/app/lib/constants";

export default function SearchForm({ onSearch = () => {} }) {
  const handleSearch = (e) => {
    const { name, value } = e.target;
    onSearch(name, value);
  };
  return (
    <form className="search-form text-sm">
      <label htmlFor="area">Area Name: </label>
      <select
        name="area"
        id="area"
        onChange={handleSearch}
      >
        <option key={ANY_AREA} value={ANY_AREA}>{ANY_AREA}</option>
        {AREAS.map((area) => (
          <option key={area} value={area}>{area}</option>
        ))}
      </select>
      <br />
      <label htmlFor="difficulty">Difficulty Rating: </label>
      <select
        name="difficulty"
        id="difficulty"
        onChange={handleSearch}
      >
        <option key={ANY_DIFFICULTY} value={ANY_DIFFICULTY}>
          {ANY_DIFFICULTY}</option>
        {DIFFICULTIES.map((diff) => (
          <option key={diff} value={diff}>{diff}</option>
        ))}
      </select>
      <label htmlFor="length"> Length: </label>
      <select
        name="length"
        id="length"
        onChange={handleSearch}
      >
        <option key={ANY_LENGTH} value={ANY_LENGTH}>{ANY_LENGTH}</option>
        {LENGTHS.map((length) => (
          <option key={length} value={length}>{length}</option>
        ))}
      </select>
      <br />
    </form>
  );
}
