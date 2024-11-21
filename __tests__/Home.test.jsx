import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders a Home component", () => {
    render(<Home />);
  });
  it("renders a title", () => {
    render(<Home />);
    screen.getByText("How to Use This Site");
    screen.debug;
  });
});


