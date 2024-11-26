import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("matches the snapshot", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it("renders a title", () => {
    render(<Home />);
    expect(screen.getByText(/How to Use This Site/)).toBeInTheDocument();
  });
});


