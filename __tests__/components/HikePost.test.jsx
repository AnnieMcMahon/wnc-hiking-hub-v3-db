import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MOCK_HIKE_DISPLAY,
  MOCK_TRAIL_INFO,
  MOCK_PARTY_TBL
} from "@/app/lib/constants";
import HikePost from "@/app/ui/components/HikePost";

const partyCount = MOCK_PARTY_TBL.length;
const partyExp = new RegExp(partyCount + " " + "participant" + "s?");

jest.mock("@/app/ui/components/AddComment", () => ({
  __esModule: true,
  AddComment: () => <div data-testid="mock-add-comment">Mock Add Comment</div>,
}));

jest.mock("@/app/ui/components/Comments", () => ({
  __esModule: true,
  Comments: () => <div data-testid="mock-comments">Mock Comments</div>,
}));

describe("HikePost", () => {
  describe("rendering", () => {
    it("renders a HikePost component with default values when no props are received", () => {
      render(<HikePost />);
      expect(screen.getByText(/alltrails link/i)).toBeInTheDocument();
    });

  it("renders the hike info correctly", () => {
    render(<HikePost hikeInfo={MOCK_HIKE_DISPLAY} />);
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

  it("renders Comments and AddComment components", () => {
    render(<HikePost hikeInfo={MOCK_HIKE_DISPLAY} />);
    expect(screen.getByTestId("mock-comments")).toBeInTheDocument();
    expect(screen.getByTestId("mock-add-comment")).toBeInTheDocument();
  });
  
});

  describe("functional", () => {
    it("does not throw when onClick is not provided", async () => {
      render(<HikePost hikeInfo={MOCK_HIKE_DISPLAY}/>);
      const button1 = screen.getByRole("button", { name: /join hike/i });
      const button2 = screen.getByRole("button", { name: partyExp });
      await userEvent.click(button1);
      await userEvent.click(button2);
    });

    it("does not crash when hikeInfo is undefined", () => {
      render(<HikePost />);
      expect(screen.getByText(/alltrails link/i)).toBeInTheDocument();
    });
    

    it("calls onClick when the button is clicked", async () => {
      const onClickMock = jest.fn();
      render(<HikePost hikeInfo={MOCK_HIKE_DISPLAY} onClick={onClickMock} />);
      const button1 = screen.getByRole("button", { name: /join hike/i });
      const button2 = screen.getByRole("button", { name: partyExp });
      await userEvent.click(button1);
      await userEvent.click(button2);
      expect(onClickMock).toHaveBeenCalledTimes(2);
    });
  });
});
