import { BLANK_BIO } from "@/app/lib/constants";

export default function EditBioForm({
  bioInfo = BLANK_BIO,
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
    <div id="edit-bio" className="mt-4">
      <h1>Edit Bio</h1>
      <div className="text-box form-area">
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
            className="file:mr-2 file:py-1 file:px-3 file:border-[1px] hover:file:cursor-pointer hover:file:bg-green-300"
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
          <div className="button-area">
            <button type="submit" className="form-button">
              Save
            </button>
            <button type="button" onClick={onClick} className="form-button">
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
