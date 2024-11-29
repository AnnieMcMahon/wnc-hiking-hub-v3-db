import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, usePathname } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import { DEFAULT_USER } from "@/app/lib/constants";
import { logout } from "@/app/api/authentication/auth";
import Navbar from "@/app/ui/components/Navbar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("@/app/api/authentication/auth", () => ({
  logout: jest.fn(),
}));

describe("Navbar", () => {
  const mockPush = jest.fn();
  const mockSetCurrentUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    useGlobal.mockReturnValue({
      currentUser: { id: 1 },
      setCurrentUser: mockSetCurrentUser,
    });
  });

  describe("rendering", () => {
    it("renders all links and button", () => {
      render(<Navbar />);
      expect(screen.getByText("WNC Hiking Hub")).toBeInTheDocument();
      expect(screen.getByText("Bio")).toBeInTheDocument();
      expect(screen.getByText("Post a Hike")).toBeInTheDocument();
      expect(screen.getByText("Join a Hike")).toBeInTheDocument();
      expect(screen.getByText("Log In")).toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("updates button message based on currentUser", () => {
      useGlobal.mockReturnValueOnce({
        currentUser: { id: 2 },
        setCurrentUser: mockSetCurrentUser,
      });
      render(<Navbar />);
      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });

    it("navigates to login page when 'Log In' button is clicked", async () => {
      render(<Navbar />);
      await userEvent.click(screen.getByText("Log In"));
      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("logs out user and navigates to home page on 'Log Out' click", async () => {
      useGlobal.mockReturnValueOnce({
        currentUser: { id: 2 },
        setCurrentUser: mockSetCurrentUser,
      });
      render(<Navbar />);
      await userEvent.click(screen.getByText("Log Out"));
      expect(mockSetCurrentUser).toHaveBeenCalledWith(DEFAULT_USER);
      expect(logout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("highlights the active link based on pathname", () => {
      usePathname.mockReturnValueOnce("/");
      render(<Navbar />);
      expect(screen.getByText("WNC Hiking Hub")).toHaveClass("active");
    });

    it("highlights the bio link when pressed", () => {
      usePathname.mockReturnValueOnce("/bio");
      render(<Navbar />);
      const bioLink = screen.getByRole("link", { name: "Bio" });
      expect(bioLink).toHaveClass("active");
    });
  });
});
