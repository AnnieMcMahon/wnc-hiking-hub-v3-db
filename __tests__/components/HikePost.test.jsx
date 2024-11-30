import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HikePost from "@/app/ui/components/HikePost";

describe("HikePost", () => {
  describe("rendering", () => {
    it("renders a HikePost component", () => {
      render(<HikePost />);
      expect(screen.getByText(/alltrails link/i)).toBeInTheDocument();
    });
  });

  describe("functional", () => {


  });
});
