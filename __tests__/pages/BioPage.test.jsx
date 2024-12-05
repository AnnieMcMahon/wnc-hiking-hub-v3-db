import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import { fetchUserHikes } from "@/app/api/data/data";
import Bio from "@/app/(dashboard)/bio/page";
import BioSection from "@/app/(dashboard)/bio/BioSection";
import HikeSection from "@/app/(dashboard)/bio/HikeSection";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  fetchUserHikes: jest.fn(),
}));

jest.mock("@/app/(dashboard)/bio/BioSection", () => jest.fn(() => <div data-testid="bio-section"></div>));
jest.mock("@/app/(dashboard)/bio/HikeSection", () => jest.fn(() => <div data-testid="hike-section"></div>));

describe("BioPage", () => {
  let mockRouterPush, mockCurrentUser;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    mockCurrentUser = { id: 1, name: "Test User" };
    mockSetTriggerRefresh = jest.fn();

    useGlobal.mockReturnValue({ 
      currentUser: mockCurrentUser,
      triggerRefresh: false, 
      setTriggerRefresh: mockSetTriggerRefresh,
    });

    fetchUserHikes.mockResolvedValue({
      upcomingHikes: [{ id: 1, title: "Upcoming Hike" }],
      pastHikes: [{ id: 2, title: "Past Hike" }],
      createdHikes: [1],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the BioSection and HikeSection components", async () => {
      render(<Bio />);
      await waitFor(() => {
        expect(screen.getByTestId("bio-section")).toBeInTheDocument();
        expect(screen.getByTestId("hike-section")).toBeInTheDocument();
      });
    });

    it("renders correctly when there is no current user", async () => {
      useGlobal.mockReturnValueOnce({ 
        currentUser: null, triggerRefresh: false, 
        setTriggerRefresh: mockSetTriggerRefresh,
      });
      render(<Bio />);
      await waitFor(() => {
        expect(screen.queryByTestId("bio-section")).toBeInTheDocument();
        expect(screen.queryByTestId("hike-section")).toBeInTheDocument();
      });
    });
  });

  describe("functionality", () => {
    it("fetches hikes for the current user on mount", async () => {
      render(<Bio />);
      await waitFor(() => {
        expect(fetchUserHikes).toHaveBeenCalledWith(mockCurrentUser.id);
      });
    });

    it("passes the correct props to HikeSection", async () => {
      render(<Bio />);
      await waitFor(() => {
        expect(HikeSection).toHaveBeenCalledWith(
          expect.objectContaining({
            pastHikes: [{ id: 2, title: "Past Hike" }],
            upcomingHikes: [{ id: 1, title: "Upcoming Hike" }],
            createdHikes: [1],
          }),
          expect.anything()
        );
      });
    });

    it("passes the current user to BioSection", async () => {
      render(<Bio />);
      await waitFor(() => {
        expect(BioSection).toHaveBeenCalledWith(
          expect.objectContaining({
            user: mockCurrentUser,
          }),
          expect.anything()
        );
      });
    });

  });
});