import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import HikeSection from "@/app/(dashboard)/bio/[user_id]/HikeSection";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import { MOCK_USER } from "@/app/lib/constants";
import HikeComponent from "@/app/ui/components/HikeComponent";

jest.mock("@/app/ui/components/HikeComponent", () => jest.fn(() => <div data-testid="hike-component"></div>));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("@/app/lib/utils", () => ({
  convertDate: jest.fn(),
  convertTime: jest.fn(),
}));

describe("HikeSection", () => {
  beforeEach(() => {
    useRouter.mockReturnValue({ push: jest.fn() });
    useGlobal.mockReturnValue({
      currentUser: MOCK_USER,
      setHike: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("functional", () => {
    it("passes the correct props to HikeComponent for an upcoming hike created by the user", async () => {
      const mockUpcomingHikes = [{
        id: 5,
        title: "Sunset Hike",
        date: "2024-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
        status: "new",
        creator_id: 1
      }];
      const mockCreatedHikes = [5];
      
      render(
        <HikeSection
          upcomingHikes={mockUpcomingHikes}
          createdHikes={mockCreatedHikes}
        />
      );
      await waitFor(() => {
        expect(HikeComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hikeType: "created",
            hikeInfo: mockUpcomingHikes[0],
          }),
          expect.anything()
        );
      });
    });

    it("passes the correct props to HikeComponent for an upcoming hike joined by the user", async () => {
      const mockUpcomingHikes = [{
        id: 5,
        title: "Sunset Hike",
        date: "2024-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
        status: "new",
        creator_id: 1
      }];
      const mockCreatedHikes = [2];
      
      render(
        <HikeSection
          upcomingHikes={mockUpcomingHikes}
          createdHikes={mockCreatedHikes}
        />
      );
      await waitFor(() => {
        expect(HikeComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hikeType: "joined",
            hikeInfo: mockUpcomingHikes[0],
          }),
          expect.anything()
        );
      });
    });

    it("passes the correct props to HikeComponent for a passed hike joined by the user", async () => {
      const mockPastHikes = [{
        id: 5,
        title: "Sunset Hike",
        date: "2025-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
        status: "new",
        creator_id: 1
      }];
      
      render(
        <HikeSection
          pastHikes={mockPastHikes}
        />
      );
      await waitFor(() => {
        expect(HikeComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hikeType: "history",
            hikeInfo: mockPastHikes[0],
          }),
          expect.anything()
        );
      });
    });
  });
});
