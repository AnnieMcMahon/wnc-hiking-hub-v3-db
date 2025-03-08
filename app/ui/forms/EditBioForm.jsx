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
    <div id="edit-bio">
      <h1>Edit Bio</h1>
      <div id="form-area" className="text-box">
        <form onSubmit={handleSubmit} className="text-sm">
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
            className="text-sm file:mr-2 file:py-1 file:px-3 file:border-[1px] file:text-md file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-green-300 hover:file:text-green-800"
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
          <button type="button" onClick={onClick} className="form-button">
            Discard
          </button>
        </form>
      </div>
    </div>
  );
}
