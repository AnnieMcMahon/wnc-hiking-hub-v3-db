import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MOCK_HIKE_DISPLAY,
  MOCK_TRAIL_INFO,
} from "@/app/lib/constants";
import HikePost from "@/app/ui/components/HikePost";

jest.mock("@/app/ui/components/AddComment", () => ({
  __esModule: true,
  AddComment: () => <div data-testid="mock-add-comment">Mock Add Comment</div>,
}));

jest.mock("@/app/ui/components/Comments", () => ({
  __esModule: true,
  Comments: () => <div data-testid="mock-comments">Mock Comments</div>,
}));

jest.mock("@/app/ui/components/Participants", () => ({
  __esModule: true,
  Participants: () => <div data-testid="mock-participants">Mock Participants</div>,
}));

describe("HikePost", () => {
  describe("rendering", () => {
    it("renders correctly with default values when no props are received", () => {
      render(<HikePost />);
      expect(screen.getByText(/alltrails link/i)).toBeInTheDocument();
    });

    it("renders hike info correctly", () => {
      render(<HikePost hikeInfo={MOCK_HIKE_DISPLAY} />);
      expect(screen.getByText("Sunset Hike, with Annie McMahon")).toBeInTheDocument();
      expect(screen.getByText("Bring water and snacks.")).toBeInTheDocument();
    });

    it("renders the AllTrails link with the correct href", () => {
      render(<HikePost trail={MOCK_TRAIL_INFO} />);
      const link = screen.getByRole("link", { name: /AllTrails Link/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", MOCK_TRAIL_INFO.trail_link);
    });

    it("renders Comments, AddComment, and Participants components", () => {
      render(<HikePost hikeInfo={MOCK_HIKE_DISPLAY} />);
      expect(screen.getByTestId("mock-comments")).toBeInTheDocument();
      expect(screen.getByTestId("mock-add-comment")).toBeInTheDocument();
      expect(screen.getByTestId("mock-participants")).toBeInTheDocument();
    });

    it("renders the button when hikeInfo.buttonMessage is provided", () => {
      render(<HikePost hikeInfo={{ ...MOCK_HIKE_DISPLAY, buttonMessage: "Join Hike" }} />);
      expect(screen.getByRole("button", { name: /join hike/i })).toBeInTheDocument();
    });

    it("does not render a button if buttonMessage is not provided", () => {
      render(<HikePost hikeInfo={{ ...MOCK_HIKE_DISPLAY, buttonMessage: "" }} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("does not throw when onClick is not provided", async () => {
      render(<HikePost hikeInfo={MOCK_HIKE_DISPLAY} />);
      const button = screen.getByRole("button", { name: /join hike/i });
      await userEvent.click(button);
    });

    it("does not crash when hikeInfo is undefined", () => {
      render(<HikePost />);
      expect(screen.getByText(/alltrails link/i)).toBeInTheDocument();
    });

    it("calls onClick with correct values when the button is clicked", async () => {
      const onClickMock = jest.fn();
      render(<HikePost hikeInfo={{ ...MOCK_HIKE_DISPLAY, buttonMessage: "Join Hike" }} onClick={onClickMock} />);
      const button = screen.getByRole("button", { name: /join hike/i });
      await userEvent.click(button);
      expect(onClickMock).toHaveBeenCalledTimes(1);
      expect(onClickMock).toHaveBeenCalledWith("Join Hike", MOCK_HIKE_DISPLAY.id.toString());
    });

    it("calls onClick multiple times for different buttons", async () => {
      const onClickMock = jest.fn();
      render(<HikePost hikeInfo={{ ...MOCK_HIKE_DISPLAY, buttonMessage: "Join Hike" }} onClick={onClickMock} />);
      const button1 = screen.getByRole("button", { name: /join hike/i });
      await userEvent.click(button1);
      expect(onClickMock).toHaveBeenCalledTimes(1);

      render(<HikePost hikeInfo={{ ...MOCK_HIKE_DISPLAY, buttonMessage: "Leave Hike" }} onClick={onClickMock} />);
      const button2 = screen.getByRole("button", { name: /leave hike/i });
      await userEvent.click(button2);
      expect(onClickMock).toHaveBeenCalledTimes(2);
    });
  });
});
