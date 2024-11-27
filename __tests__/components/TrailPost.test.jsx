import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrailPost from "@/app/ui/components/TrailPost";

const mockTrailInfo = {
  trail_name: "Blue Ridge Trail",
  area_name: "Blue Ridge Mountains",
  difficulty_rating: "Moderate",
  length: 5.4,
  elevation_gain: 1200,
  route_type: "Loop",
  trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
};

describe("TrailPost", () => {
  describe("rendering", () => {
    it("renders a TrailPost component when no trailInfo is received", () => {
      render(<TrailPost />);
      const heading = screen.getByRole("heading", { name: "" });
      expect(heading).toBeInTheDocument();
    });

    it("renders the trail info correctly", () => {
      render(<TrailPost trailInfo={mockTrailInfo} />);
      expect(screen.getByText(mockTrailInfo.trail_name)).toBeInTheDocument();
      expect(screen.getByText(mockTrailInfo.area_name)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${mockTrailInfo.difficulty_rating} * ${mockTrailInfo.length} mi * ${mockTrailInfo.elevation_gain} ft * ${mockTrailInfo.route_type}`
        )
      ).toBeInTheDocument();
    });

    it("renders the AllTrails link with the correct href", () => {
      render(<TrailPost trailInfo={mockTrailInfo} />);
      const link = screen.getByRole("link", { name: /AllTrails Link/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", mockTrailInfo.trail_link);
    });
  });

  describe("functional", () => {
    it("calls onClick when the div is clicked", async () => {
      const mockOnClick = jest.fn();
      render(<TrailPost trailInfo={mockTrailInfo} onClick={mockOnClick} />);
      const trailPostDiv = screen.getByText(mockTrailInfo.trail_name);
      await userEvent.click(trailPostDiv);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when the AllTrails link is clicked", async () => {
      const mockOnClick = jest.fn();
      render(<TrailPost trailInfo={mockTrailInfo} onClick={mockOnClick} />);
      const link = screen.getByRole("link", { name: /AllTrails Link/i });
      await userEvent.click(link);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("does not throw when onClick is not provided", async () => {
      render(<TrailPost trailInfo={mockTrailInfo} />);
      const trailPostDiv = screen.getByText(mockTrailInfo.trail_name);
      await userEvent.click(trailPostDiv);
    });
  });
});
