export default function HikeForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
            <label htmlFor="hikeTitle">Title: </label>
            <input type="text" name="hikeTitle" id="hikeTitle" />
            <br />
            <label htmlFor="date">Date: </label>
            <input type="date" name="date" id="date" />
            <label htmlFor="time"> Time: </label>
            <input type="time" name="time" id="time" />
            <br />
            <label htmlFor="location"> Location: </label>
            <input type="text" name="location" id="location" />
            <br />
            <label htmlFor="comments">Comments: </label>
            <br />
            <textarea
              type="textarea"
              name="comments"
              id="comments"
              data-gramm="false"
            />
            <br />
            <button type="submit" className="form-button">
              Submit Form
            </button>
          </form>
  );
};