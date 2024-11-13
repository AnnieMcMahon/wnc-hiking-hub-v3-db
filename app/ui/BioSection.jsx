import { DEFAULT_USER_NAME, DEFAULT_BIO, DEFAULT_AVATAR } from "../lib/constants";

export default function BioSection({user, onClick}) {


  return (
    <div className="bio-section">
        <div className="bio-header-section">
          <img className="avatar" src={user.avatar ? user.avatar : DEFAULT_AVATAR} alt="avatar"/>
          <h1>{user.user_name ? user.user_name : DEFAULT_USER_NAME}</h1>
          <button onClick={onClick}>Edit Bio</button>
        </div>
        <div className="bio-text-section">
          <h2>About Me</h2>
          <div id="bio-text" className="text-box">
            <p>{user.bio ? user.bio : DEFAULT_BIO}</p>
          </div>
        </div>
      </div>
  );
};