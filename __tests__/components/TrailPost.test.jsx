import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MOCK_TRAIL_INFO } from "@/app/lib/constants";
import TrailPost from "@/app/ui/components/TrailPost";

describe("TrailPost", () => {
  describe("rendering", () => {
    it("renders a TrailPost component when no trailInfo is received", () => {
      render(<TrailPost />);
      const heading = screen.getByRole("heading", { name: "" });
      expect(heading).toBeInTheDocument();
    });

    it("renders the trail info correctly", () => {
      render(<TrailPost trailInfo={MOCK_TRAIL_INFO} />);
      expect(screen.getByText(MOCK_TRAIL_INFO.trail_name)).toBeInTheDocument();
      expect(screen.getByText(MOCK_TRAIL_INFO.area_name)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${MOCK_TRAIL_INFO.difficulty_rating} * ${MOCK_TRAIL_INFO.length} mi * ${MOCK_TRAIL_INFO.elevation_gain} ft elev gain * ${MOCK_TRAIL_INFO.route_type}`
        )
      ).toBeInTheDocument();
    });

    it("renders the AllTrails link with the correct href", () => {
      render(<TrailPost trailInfo={MOCK_TRAIL_INFO} />);
      const link = screen.getByRole("link", { name: /AllTrails Link/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", MOCK_TRAIL_INFO.trail_link);
    });
  });

  describe("functional", () => {
    it("does not throw when onClick is not provided", async () => {
      render(<TrailPost trailInfo={MOCK_TRAIL_INFO} />);
      const trailPostDiv = screen.getByText(MOCK_TRAIL_INFO.trail_name);
      await userEvent.click(trailPostDiv);
    });
    
    it("calls onClick when the div is clicked", async () => {
      const mockOnClick = jest.fn();
      render(<TrailPost trailInfo={MOCK_TRAIL_INFO} onClick={mockOnClick} />);
      const trailPostDiv = screen.getByText(MOCK_TRAIL_INFO.trail_name);
      await userEvent.click(trailPostDiv);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when the AllTrails link is clicked", async () => {
      const mockOnClick = jest.fn();
      render(<TrailPost trailInfo={MOCK_TRAIL_INFO} onClick={mockOnClick} />);
      const link = screen.getByRole("link", { name: /AllTrails Link/i });
      await userEvent.click(link);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
