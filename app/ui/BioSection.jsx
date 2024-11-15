import { DEFAULT_USER_NAME, DEFAULT_BIO, DEFAULT_AVATAR } from "../lib/constants";

export default function BioSection({user, onClick}) {
  const avatar = user.avatar || DEFAULT_AVATAR;
  const userName = user.user_name || DEFAULT_USER_NAME;
  const bio = user.bio || DEFAULT_BIO;

  return (
    <div className="bio-section">
        <div className="bio-header-section">
          <img className="avatar" src={avatar} alt="avatar"/>
          <h1>{userName}</h1>
          <button onClick={onClick}>Edit Bio</button>
        </div>
        <div className="bio-text-section">
          <h2>About Me</h2>
          <div id="bio-text" className="text-box">
            <p>{bio}</p>
          </div>
        </div>
      </div>
  );
};