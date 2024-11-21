import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BioSection from "@/app/ui/BioSection";

const user = {
  email: "user@gmail.com",
  avatar: "/newUser.png",
  user_name: "New User",
  bio: "Tell us about yourself"
};

describe("BioSection", () => {
  it("renders a BioSection component", () => {
    render(<BioSection user={user}/>);
  });

  it("renders a title", () => {
    render(<BioSection user={user} />);
    screen.getByText("About Me");
    screen.debug;
  });
});