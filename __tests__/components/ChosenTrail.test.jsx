import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ChosenTrail from "@/app/ui/components/ChosenTrail";

const mockTrailInfo = {
  trail_name: "Blue Ridge Trail",
  area_name: "Blue Ridge Mountains",
  difficulty_rating: "moderate",
  length: 5.4,
  elevation_gain: 1200,
  route_type: "loop",
  trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
};

describe("ChosenTrail", () => {
  describe("rendering", () => {
    it("renders a ChosenTrail component when trailSelected is not provided", () => {
      render(<ChosenTrail />);
      expect(screen.getByText(/choose a trail/i)).toBeInTheDocument();
    });

    it("renders the trail info correctly", () => {
      render(<ChosenTrail trailSelected={mockTrailInfo} />);
      expect(screen.getByText(mockTrailInfo.trail_name)).toBeInTheDocument();
      expect(screen.getByText(mockTrailInfo.area_name)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${mockTrailInfo.difficulty_rating} * ${mockTrailInfo.length} mi * ${mockTrailInfo.elevation_gain} ft * ${mockTrailInfo.route_type}`
        )
      ).toBeInTheDocument();
    });

    it("renders the AllTrails link with the correct href", () => {
      render(<ChosenTrail trailSelected={mockTrailInfo} />);
      const link = screen.getByRole("link", { name: /AllTrails Link/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", mockTrailInfo.trail_link);
    });
  });
});
