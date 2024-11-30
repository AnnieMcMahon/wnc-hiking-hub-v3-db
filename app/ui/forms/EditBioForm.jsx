import { BLANK_BIO } from "@/app/lib/constants";

export default function EditBioForm({
  bioInfo = { BLANK_BIO },
  onSubmit = () => {},
  onClick = () => {},
  onChange = () => {},
  handleAvatarChange = () => {},
}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedBio = Object.fromEntries(formData.entries());
    onSubmit(updatedBio);
  };

  return (
    <div id="edit-bio">
      <h1>Edit Bio</h1>
      <div id="form-area" className="text-box">
        <form onSubmit={handleSubmit}>
          <label htmlFor="user_name">Name: </label>
          <input
            type="text"
            name="user_name"
            id="user_name"
            value={bioInfo.user_name || ""}
            autoComplete="true"
            onChange={onChange}
          />
          <br />
          <label htmlFor="newAvatar">Avatar: </label>
          <input
            type="file"
            accept="image/*"
            name="avatar"
            id="newAvatar"
            onChange={handleAvatarChange}
          />
          <br />
          <label htmlFor="newBio">Bio: </label>
          <textarea
            name="bio"
            id="newBio"
            value={bioInfo.bio || ""}
            data-gramm="false"
            onChange={onChange}
          />
          <br />
          <button type="submit" className="form-button">
            Save
          </button>
          <button onClick={onClick} className="form-button">
            Discard
          </button>
        </form>
      </div>
    </div>
  );
}
