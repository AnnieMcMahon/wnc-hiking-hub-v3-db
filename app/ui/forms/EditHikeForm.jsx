import { useModal } from "@/app/context/ModalContext";
import { BLANK_HIKE } from "@/app/lib/constants";

export default function EditHikeForm({
  hikeInfo = { BLANK_HIKE },
  onSubmit = () => {},
  onChange = () => {},
  handleCancel = () => {},
  handleDiscard = () => {},
}) {

  const { showModal } = useModal();
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedHike = Object.fromEntries(formData.entries());
    if (Object.values(updatedHike).some((value) => !value)) {
      showModal("Error", "Please fill out all the information");
    } else {
      onSubmit(updatedHike);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-sm">
      <label htmlFor="newTitle">Title: </label>
      <input
        type="text"
        name="title"
        id="newTitle"
        value={hikeInfo.title}
        onChange={onChange}
      />
      <br />

      <label htmlFor="newDate">Date: </label>
      <input
        type="date"
        name="date"
        id="newDate"
        min={today}
        value={hikeInfo.date}
        onChange={onChange}
      />
      <br />

      <label htmlFor="newTime"> Time: </label>
      <input
        type="time"
        name="time"
        id="newTime"
        value={hikeInfo.time}
        onChange={onChange}
      />
      <br />

      <label htmlFor="newLocation"> Location: </label>
      <input
        type="text"
        name="location"
        id="newLocation"
        value={hikeInfo.location}
        onChange={onChange}
      />
      <br />

      <label htmlFor="newMaxPartic"> Max Participants: </label>
      <input
        type="number"
        name="maxParticipants"
        id="newMaxPartic"
        min="2" max="30" placeholder="10"
        value={hikeInfo.maxParticipants
          ? hikeInfo.maxParticipants
          : "10"
        }
        onChange={onChange}
      />
      <br />  

      <label htmlFor="newComments">Comments: </label>
      <br />
      <textarea
        type="textarea"
        name="comments"
        id="newComments"
        value={hikeInfo.comments}
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
}
