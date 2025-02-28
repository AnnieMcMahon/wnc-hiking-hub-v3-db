import { DEFAULT_USER_NAME, DEFAULT_BIO, DEFAULT_AVATAR } from "@/app/lib/constants";
import { Button } from "@/components/ui/button";

export default function BioSection({ user = {}, onClick = () => {} }) {
  const avatar = user.avatar || DEFAULT_AVATAR;
  const userName = user.user_name || DEFAULT_USER_NAME;
  const bio = user.bio || DEFAULT_BIO;
  const handleClick = () => {onClick()};
  return (
    <div className="bio-section">
        <div className="bio-header-section">
          <img className="avatar" src={avatar} alt="avatar"/>
          <h1>{userName}</h1>
          <Button onClick={handleClick}>Edit Bio</Button>
        </div>
        <div className="bio-text-section">
          <h2>About Me</h2>
          <div id="bio-text" className="text-box">
            <p className="text-sm text-left pt-2">{bio}</p>
          </div>
        </div>
      </div>
  );
};