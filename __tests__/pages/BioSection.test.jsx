import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BioSection from "@/app/(dashboard)/bio/BioSection";
import {
  DEFAULT_USER_NAME,
  DEFAULT_BIO,
  DEFAULT_AVATAR,
  DEFAULT_USER,
} from "@/app/lib/constants";

describe("BioSection", () => {
  describe("rendering", () => {
    it("renders a BioSection component", () => {
      render(<BioSection user={DEFAULT_USER} />);
      expect(screen.getByText(/about me/i)).toBeInTheDocument();
    });

    it("uses default values when user properties are missing", () => {
      const minimalUser = {};
      render(<BioSection user={minimalUser} />);
      expect(screen.getByText(DEFAULT_USER_NAME)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_BIO)).toBeInTheDocument();
      const avatar = screen.getByAltText("avatar");
      expect(avatar).toHaveAttribute("src", DEFAULT_AVATAR);
    });

    it("renders user data correctly", () => {
      render(<BioSection user={DEFAULT_USER} />);
      expect(screen.getByText("Demo User")).toBeInTheDocument();
      expect(screen.getByText(/Bio text goes here/)).toBeInTheDocument();
      const avatar = screen.getByAltText("avatar");
      expect(avatar).toHaveAttribute("src", "/newUser.png");
    });

    it("renders with no user prop", () => {
      render(<BioSection />);
      expect(screen.getByText(DEFAULT_USER_NAME)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_BIO)).toBeInTheDocument();
      const avatar = screen.getByAltText("avatar");
      expect(avatar).toHaveAttribute("src", DEFAULT_AVATAR);
    });

    it("has the correct structure and accessibility", () => {
      render(<BioSection user={DEFAULT_USER} />);
      const avatar = screen.getByAltText("avatar");
      expect(avatar).toBeInTheDocument();
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Demo User");
      const bioText = screen.getByText(/Bio text goes here/);
      expect(bioText).toBeInTheDocument();
      const button = screen.getByRole("button", { name: /edit bio/i });
      expect(button).toBeInTheDocument();
    });

    it("applies the correct CSS classes", () => {
      render(<BioSection user={DEFAULT_USER} />);
      const bioSection = screen
        .getByText(/Bio text goes here/)
        .closest(".bio-section");
      expect(bioSection).toHaveClass("bio-section");
      const headerSection = screen
        .getByText("Demo User")
        .closest(".bio-header-section");
      expect(headerSection).toHaveClass("bio-header-section");
    });
  });

  describe("functional", () => {
    it("does not throw when onClick is not provided", async () => {
      render(<BioSection user={DEFAULT_USER} />);
      const button = screen.getByRole("button", { name: /edit bio/i });
      await userEvent.click(button);
    });

    it("calls onClick when 'Edit Bio' button is clicked", async () => {
      const mockOnClick = jest.fn();
      render(<BioSection user={DEFAULT_USER} onClick={mockOnClick} />);
      const button = screen.getByRole("button", { name: /edit bio/i });
      await userEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
