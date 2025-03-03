import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useGlobal } from "@/app/context/GlobalContext";
import userEvent from "@testing-library/user-event";
import BioSection from "@/app/(dashboard)/bio/[user_id]/BioSection";
import {
  DEFAULT_USER_NAME,
  DEFAULT_BIO,
  DEFAULT_AVATAR,
} from "@/app/lib/constants";

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

describe("BioSection", () => {
  const mockCurrentUser = { id: 1, user_name: "Current User" };
  const mockUser = { id: 1, user_name: "Demo User", bio: "Bio text goes here", avatar: "/newUser.png" };
  const otherUser = { id: 2, user_name: "Another User", bio: "Other bio", avatar: "/otherUser.png" };

  beforeEach(() => {
    jest.clearAllMocks();
    useGlobal.mockReturnValue({
      currentUser: mockCurrentUser,
    });
  });

  describe("rendering", () => {
    it("renders a BioSection component", () => {
      render(<BioSection user={mockUser} />);
      expect(screen.getByText(/about me/i)).toBeInTheDocument();
    });

    it("uses default values when user properties are missing", () => {
      render(<BioSection user={{}} />);
      expect(screen.getByText(DEFAULT_USER_NAME)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_BIO)).toBeInTheDocument();
      expect(screen.getByAltText("avatar")).toHaveAttribute("src", DEFAULT_AVATAR);
    });

    it("renders user data correctly", () => {
      render(<BioSection user={mockUser} />);
      expect(screen.getByText("Demo User")).toBeInTheDocument();
      expect(screen.getByText(/bio text goes here/i)).toBeInTheDocument();
      expect(screen.getByAltText("avatar")).toHaveAttribute("src", "/newUser.png");
    });

    it("renders with no user prop", () => {
      render(<BioSection />);
      expect(screen.getByText(DEFAULT_USER_NAME)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_BIO)).toBeInTheDocument();
      expect(screen.getByAltText("avatar")).toHaveAttribute("src", DEFAULT_AVATAR);
    });

    it("has the correct structure and accessibility", () => {
      render(<BioSection user={mockUser} />);
      expect(screen.getByAltText("avatar")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Demo User");
      expect(screen.getByText("Bio text goes here")).toBeInTheDocument();
    });

    it("shows the Edit Bio button when the user is the current user", () => {
      render(<BioSection user={mockUser} />);
      expect(screen.getByRole("button", { name: /edit bio/i })).toBeInTheDocument();
    });

    it("does not show the Edit Bio button for a different user", () => {
      render(<BioSection user={otherUser} />);
      expect(screen.queryByRole("button", { name: /edit bio/i })).not.toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("does not throw when onClick is not provided", async () => {
      render(<BioSection user={mockUser} />);
      const button = screen.getByRole("button", { name: /edit bio/i });
      await userEvent.click(button);
    });

    it("calls onClick when 'Edit Bio' button is clicked", async () => {
      const mockOnClick = jest.fn();
      render(<BioSection user={mockUser} onClick={mockOnClick} />);
      const button = screen.getByRole("button", { name: /edit bio/i });
      await userEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
