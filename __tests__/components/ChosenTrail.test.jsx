import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MOCK_TRAIL_INFO } from "@/app/lib/constants";
import ChosenTrail from "@/app/ui/components/ChosenTrail";

describe("ChosenTrail", () => {
  describe("rendering", () => {
    it("renders a ChosenTrail component when trailSelected is not provided", () => {
      render(<ChosenTrail />);
      expect(screen.getByText(/choose a trail/i)).toBeInTheDocument();
    });

    it("renders the trail info correctly", () => {
      render(<ChosenTrail trailSelected={MOCK_TRAIL_INFO} />);
      expect(screen.getByText(MOCK_TRAIL_INFO.trail_name)).toBeInTheDocument();
      expect(screen.getByText(MOCK_TRAIL_INFO.area_name)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${MOCK_TRAIL_INFO.difficulty_rating} * ${MOCK_TRAIL_INFO.length} mi * ${MOCK_TRAIL_INFO.elevation_gain} ft * ${MOCK_TRAIL_INFO.route_type}`
        )
      ).toBeInTheDocument();
    });

    it("renders the AllTrails link with the correct href", () => {
      render(<ChosenTrail trailSelected={MOCK_TRAIL_INFO} />);
      const link = screen.getByRole("link", { name: /AllTrails Link/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", MOCK_TRAIL_INFO.trail_link);
    });
  });
});
