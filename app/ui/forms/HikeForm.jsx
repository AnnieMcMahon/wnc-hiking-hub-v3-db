import { useModal } from "@/app/context/ModalContext";

export default function HikeForm({ onSubmit = () => {} }) {
  const { showModal } = useModal();
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newHike = Object.fromEntries(formData.entries());
    if (newHike.maxParticipants == "") {
      newHike.maxParticipants = "10";
    }
    if (Object.entries(newHike).some(([key, value]) => key !== "maxParticipants" && !value)) {
      showModal("Error", "Please fill out all the information");
    } else {
      onSubmit(newHike);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mini-form">
      <label htmlFor="hikeTitle">Title: </label>
      <input type="text" name="hikeTitle" id="hikeTitle" />
      <br />
      <label htmlFor="date">Date: </label>
      <input type="date" name="date" id="date" min={today} />
      <br/>
      <label htmlFor="time"> Time: </label>
      <input type="time" name="time" id="time" />
      <br />
      <label htmlFor="location"> Location: </label>
      <input type="text" name="location" id="location" />
      <br />
      <label htmlFor="maxParticipants">Max Participants (default 10, max 30): </label>
      <input type="number" name="maxParticipants" id="maxParticipants" min="2" max="30" placeholder="10" />
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
}
