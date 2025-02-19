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

jest.mock("@/components/ui/menubar", () => ({
  Menubar: ({ children, ...props }) => <nav {...props}>{children}</nav>,
}));

jest.mock("@/components/ui/navigation-menu", () => ({
  NavigationMenu: ({ children, ...props }) => <div {...props}>{children}</div>,
  NavigationMenuLink: ({ children, ...props }) => <a {...props}>{children}</a>,
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
      expect(screen.getByRole("link", { name: /WNC Hiking Hub/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Bio/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Post a Hike/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Join a Hike/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("updates button message based on currentUser", () => {
      useGlobal.mockReturnValueOnce({
        currentUser: { id: 2 },
        setCurrentUser: mockSetCurrentUser,
      });
      render(<Navbar />);
      expect(screen.getByRole("button", { name: /Log Out/i })).toBeInTheDocument();
    });

    it("navigates to login page when 'Log In' button is clicked", async () => {
      render(<Navbar />);
      await userEvent.click(screen.getByRole("button", { name: /Log In/i }));
      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("logs out user and navigates to home page on 'Log Out' click", async () => {
      useGlobal.mockReturnValueOnce({
        currentUser: { id: 2 },
        setCurrentUser: mockSetCurrentUser,
      });
      render(<Navbar />);
      await userEvent.click(screen.getByRole("button", { name: /Log Out/i }));
      expect(mockSetCurrentUser).toHaveBeenCalledWith(DEFAULT_USER);
      expect(logout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("verifies the WNC Hiking Hub link is active when the pathname is /", () => {
      usePathname.mockReturnValueOnce("/");
      render(<Navbar />);
      expect(screen.getByRole("link", { name: /WNC Hiking Hub/i })).toHaveClass("text-green-600");
    });

    it("verifies the Bio link is active when the pathname is /bio", () => {
      usePathname.mockReturnValueOnce("/bio");
      render(<Navbar />);
      expect(screen.getByRole("link", { name: /Bio/i })).toHaveClass("text-green-600 font-bold");
    });
  });
});
