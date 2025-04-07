import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useRouter, useParams } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import { fetchUserHikes } from "@/app/hooks/fetchUserHikes";
import { fetchUserById } from "@/app/api/data/data";
import Bio from "@/app/(dashboard)/bio/[user_id]/page";
import BioSection from "@/app/(dashboard)/bio/[user_id]/BioSection";
import HikeSection from "@/app/(dashboard)/bio/[user_id]/HikeSection";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("@/app/hooks/fetchUserHikes", () => ({
  fetchUserHikes: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  fetchUserById: jest.fn(),
}));

jest.mock("@/app/(dashboard)/bio/[user_id]/BioSection", () =>
  jest.fn(({ user, onClick }) => (
    <div data-testid="bio-section">
      <p>{user?.name}</p>
      <button onClick={onClick}>Edit Bio</button>
    </div>
  ))
);

jest.mock("@/app/(dashboard)/bio/[user_id]/HikeSection", () =>
  jest.fn(() => <div data-testid="hike-section"></div>)
);

describe("Bio Page", () => {
  let mockRouterPush, mockCurrentUser, mockSetTriggerRefresh;
  const userInfo = { id: 3, name: "Test User" };

  beforeEach(() => {
    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    useParams.mockReturnValue({ user_id: "3" });

    mockCurrentUser = { id: "3", name: "Current User" };
    mockSetTriggerRefresh = jest.fn();

    useGlobal.mockReturnValue({
      currentUser: mockCurrentUser,
      triggerRefresh: false,
      setTriggerRefresh: mockSetTriggerRefresh,
    });

    fetchUserById.mockResolvedValue([userInfo]);

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
    it("renders the BioSection and HikeSection components after data loads", async () => {
      render(<Bio />);
      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByTestId("bio-section")).toBeInTheDocument();
        expect(screen.getByTestId("hike-section")).toBeInTheDocument();
        expect(screen.getByText(userInfo.name)).toBeInTheDocument();
      });
    });
  });

  describe("functionality", () => {
    it("fetches user data on mount", async () => {
      render(<Bio />);
      await waitFor(() => {
        expect(fetchUserById).toHaveBeenCalledWith("3");
      });
    });

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

    it("passes the correct user data to BioSection", async () => {
      render(<Bio />);
      await waitFor(() => {
        expect(BioSection).toHaveBeenCalledWith(
          expect.objectContaining({
            user: userInfo,
          }),
          expect.anything()
        );
      });
    });

    it("navigates to edit bio page when 'Edit Bio' button is clicked", async () => {
      render(<Bio />);
      await waitFor(() => {
        fireEvent.click(screen.getByRole("button", { name: /Edit Bio/i }));
        expect(mockRouterPush).toHaveBeenCalledWith("/edit-bio");
      });
    });

    it("does not fetch upcoming or created hikes for a different user", async () => {
      useParams.mockReturnValue({ user_id: "2" });
      render(<Bio />);
      await waitFor(() => {
        expect(fetchUserHikes).toHaveBeenCalledWith("2");
        expect(HikeSection).toHaveBeenCalledWith(
          expect.objectContaining({
            pastHikes: [{ id: 2, title: "Past Hike" }],
            upcomingHikes: [],
            createdHikes: [],
          }),
          expect.anything()
        );
      });
    });
  });
});
