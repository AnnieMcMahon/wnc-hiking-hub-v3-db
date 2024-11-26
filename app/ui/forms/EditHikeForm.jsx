export default function EditHikeForm({hikeInfo, onSubmit, onChange, handleCancel, handleDiscard }) {
  return (
    <form onSubmit={onSubmit}>
    <label htmlFor="newTitle">Title: </label>
    <input
      type="text"
      name="title"
      id="newTitle"
      value={hikeInfo.title ? hikeInfo.title : ""}
      onChange={onChange}
    />
    <br />

    <label htmlFor="newDate">Date: </label>
    <input
      type="date"
      name="date"
      id="newDate"
      value={hikeInfo.date ? hikeInfo.date : ""}
      onChange={onChange}
    />
    <br />

    <label htmlFor="newTime"> Time: </label>
    <input
      type="time"
      name="time"
      id="newTime"
      value={hikeInfo.time ? hikeInfo.time : ""}
      onChange={onChange}
    />
    <br />

    <label htmlFor="newLocation"> Location: </label>
    <input
      type="text"
      name="location"
      id="newLocation"
      value={hikeInfo.location ? hikeInfo.location : ""}
      onChange={onChange}
    />
    <br />

    <label htmlFor="newComments">Comments: </label>
    <br />
    <textarea
      type="textarea"
      name="comments"
      id="newComments"
      value={hikeInfo.comments ? hikeInfo.comments : ""}
      data-gramm="false"
      onChange={onChange}
    />
    <br />
    <button type="submit" className="form-button">
      Save Changes
    </button>
    <button type="reset" onClick={handleDiscard} className="form-button">
      Discard Changes
    </button>
    <button type="button" onClick={handleCancel} className="form-button">
      Cancel Hike
    </button>
  </form>
  );
};