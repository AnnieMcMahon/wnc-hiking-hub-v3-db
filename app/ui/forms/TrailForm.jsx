import { useModal } from "@/app/context/ModalContext";
import { AREAS, DIFFICULTIES, ROUTE_TYPES } from "@/app/lib/constants";

export default function TrailForm({ onSubmit = () => {}, onClick = () => {} }) {
  const { showModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTrail = Object.fromEntries(formData.entries());
    if (Object.values(newTrail).some((value) => !value)) {
      showModal("Error", "Please complete all information");
    } else {
      onSubmit(newTrail);
    }
  };

  const handleClick = () => {
    onClick();
  };

  return (
    <div id="add-trail" className="mt-4">
      <h1>Add New Trail</h1>
      <div className="text-box form-area">
        <form
          className="h-96"
          onSubmit={handleSubmit}
        >
          <p className="pb-4">
            Enter all the information from{" "}
            <a href="https://www.alltrails.com/" target="_blank">
              AllTrails
            </a>
            :
          </p>
          <label htmlFor="trail_name">Trail Name: </label>
          <input type="text" name="trail_name" id="trail_name" />
          <br />
          <label htmlFor="area_name">Area Name: </label>
          <input
            list="area_name_list"
            name="area_name"
            id="area_name"
            aria-label="Area Name"
          />
          <datalist id="area_name_list">
            {AREAS.map((area) => (
              <option key={area} value={area} />
            ))}
          </datalist>
          <br />
          <label htmlFor="difficulty_rating"> Difficulty Rating: </label>
          <select name="difficulty_rating" id="difficulty_rating">
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="length"> Length (mi): </label>
          <input type="number" step=".1" name="length" id="length" />
          <br />
          <label htmlFor="elevation_gain">Elevation Gain (ft): </label>
          <input type="number" name="elevation_gain" id="elevation_gain" />
          <br />
          <label htmlFor="route_type"> Route Type: </label>
          <select name="route_type" id="route_type">
            {ROUTE_TYPES.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="trail_link"> AllTrails Link: </label>
          <input type="trail_link" name="trail_link" id="trail_link" />
          <br />
          <div className="button-area">
            <button type="submit" className="w-32 h-8">
              Submit Form
            </button>
            <button type="button" className="w-32 h-8" onClick={handleClick}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
