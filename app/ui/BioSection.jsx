export default function BioSection({user, onClick}) {
  return (
    <div className="bio-section">
        <div className="bio-header-section">
          <img className="avatar" src={user.avatar} alt="avatar"/>
          <h1>{user.user_name}</h1>
          <button onClick={onClick}>Edit Bio</button>
        </div>
        <div className="bio-text-section">
          <h2>About Me</h2>
          <div id="bio-text" className="text-box">
            <p>{user.bio}</p>
          </div>
        </div>
      </div>
  );
};