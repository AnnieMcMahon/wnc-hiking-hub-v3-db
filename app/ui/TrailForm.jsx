export default function TrailForm({ onSubmit }) {
  return (
    <form className="trail-form" onSubmit={onSubmit}>
      <p>Copy and paste all the information from AllTrails:</p>
      <label htmlFor="trailName">Name: </label>
      <input type="text" name="trailName" id="trailName" />
      <br />
      <label htmlFor="area">Area: </label>
      <input type="text" name="area" id="area" />
      <br />
      <label htmlFor="difficulty"> Difficulty: </label>
      <select name="difficulty" id="difficulty">
        <option value="Easy">Easy</option>
        <option value="Moderate">Moderate</option>
        <option value="Strenuous">Strenuous</option>
      </select>
      <br />
      <label htmlFor="length"> Length: </label>
      <input type="number" step=".1" name="length" id="length" />
      <br />
      <label htmlFor="elevation">Elevation: </label>
      <input type="number" name="elevation" id="elevation" />
      <br />
      <label htmlFor="type"> Type: </label>
      <select name="type" id="type">
        <option value="Loop">Loop</option>
        <option value="Out-and-back">Out-and-back</option>
        <option value="Point-to-point">Point-to-point</option>
      </select>
      <br />
      <label htmlFor="link"> Link: </label>
      <input type="link" name="link" id="link" />
      <br />
      <div className="form-button-section">
      <button type="submit" className="form-button">
        Submit Form
      </button>
      </div>
    </form>
  );
}