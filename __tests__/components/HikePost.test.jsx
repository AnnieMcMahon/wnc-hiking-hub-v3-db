import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MOCK_HIKE_INFO, MOCK_TRAIL_INFO } from "@/app/lib/constants";
import HikePost from "@/app/ui/components/HikePost";

describe("HikePost", () => {
  describe("rendering", () => {
    it("renders a HikePost component with default values when no props are received", () => {
      render(<HikePost />);
      expect(screen.getByText(/alltrails link/i)).toBeInTheDocument();
    });
  });

  it("renders the hike info correctly", () => {
    render(<HikePost hikeInfo={MOCK_HIKE_INFO} />);
    expect(screen.getByText("Sunset Hike, with Annie McMahon")).toBeInTheDocument();
    expect(screen.getByText("Bring water and snacks.")).toBeInTheDocument();
  });

  it("renders the AllTrails link with the correct href", () => {
    render(<HikePost trail={MOCK_TRAIL_INFO} />);
    const link = screen.getByRole("link", { name: /AllTrails Link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", MOCK_TRAIL_INFO.trail_link);
  });

  describe("functional", () => {
    it("does not throw when onClick is not provided", async () => {
      render(<HikePost hikeInfo={MOCK_HIKE_INFO}/>);
      const button = screen.getByRole("button", { name: /join hike/i });
      await userEvent.click(button);
    });

    it("calls onClick when the button is clicked", async () => {
      const onClickMock = jest.fn();
      render(<HikePost hikeInfo={MOCK_HIKE_INFO} onClick={onClickMock} />);
      const button = screen.getByRole("button", { name: /join hike/i });
      await userEvent.click(button);
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });
  });
});
