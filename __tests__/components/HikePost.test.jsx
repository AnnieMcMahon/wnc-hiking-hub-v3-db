import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MOCK_HIKE_INFO,
  MOCK_TRAIL_INFO,
  MOCK_PARTY_TBL
} from "@/app/lib/constants";
import HikePost from "@/app/ui/components/HikePost";

const partyCount = MOCK_PARTY_TBL.length;
const partyExp = new RegExp(partyCount + " " + "participant" + "s?");

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
    expect(screen.getByRole('button', { name: partyExp })).toBeInTheDocument();
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
      const button1 = screen.getByRole("button", { name: /join hike/i });
      const button2 = screen.getByRole("button", { name: partyExp });
      await userEvent.click(button1);
      await userEvent.click(button2);
    });

    it("calls onClick when the button is clicked", async () => {
      const onClickMock = jest.fn();
      render(<HikePost hikeInfo={MOCK_HIKE_INFO} onClick={onClickMock} />);
      const button1 = screen.getByRole("button", { name: /join hike/i });
      const button2 = screen.getByRole("button", { name: partyExp });
      await userEvent.click(button1);
      await userEvent.click(button2);
      expect(onClickMock).toHaveBeenCalledTimes(2);
    });
  });
});
