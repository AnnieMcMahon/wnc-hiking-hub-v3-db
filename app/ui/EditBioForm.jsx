export default function EditBioForm({bioInfo, onSubmit, onClick, onChange, handleAvatarChange }) {
  return (
<div id="edit-bio">
      <h1>Edit Bio</h1>
      <div id="form-area" className="text-box">
        <form onSubmit={onSubmit}>
          <label htmlFor="newName">Name: </label>
          <input
            type="text"
            name="name"
            id="newName"
            value={bioInfo.name || ""}
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
};