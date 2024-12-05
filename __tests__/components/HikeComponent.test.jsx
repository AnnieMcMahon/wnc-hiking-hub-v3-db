import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import {
  fetchTrailById,
  fetchUserById,
  addParticipant,
  removeParticipant,
} from "@/app/api/data/data";
import { convertDate, convertTime } from "@/app/lib/utils";
import { MOCK_HIKE, MOCK_USER, MOCK_TRAIL_INFO } from "@/app/lib/constants";
import HikeComponent from "@/app/ui/components/HikeComponent";

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

jest.mock("@/app/api/data/data", () => ({
  fetchTrailById: jest.fn(),
  fetchUserById: jest.fn(),
  addParticipant: jest.fn(),
  removeParticipant: jest.fn(),
}));

describe("HikeComponent", () => {
  let mockRouterPush, mockSetHike;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    mockSetHike = jest.fn();
    mockSetTriggerRefresh = jest.fn();

    useGlobal.mockReturnValue({
      currentUser: MOCK_USER,
      setHike: mockSetHike,
      setTriggerRefresh: mockSetTriggerRefresh,
    });

    convertDate.mockReturnValue("12/01/2024");
    convertTime.mockReturnValue("10:00 AM");

    fetchTrailById.mockResolvedValue([MOCK_TRAIL_INFO]);
    fetchUserById.mockResolvedValue([MOCK_USER]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the HikePost component with initial data", async () => {
      render(<HikeComponent hikeType="new" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        expect(screen.getByText(/sunset hike/i)).toBeInTheDocument();
      });
      expect(fetchTrailById).toHaveBeenCalledWith(MOCK_HIKE.trail_id);
      expect(fetchUserById).toHaveBeenCalledWith(MOCK_HIKE.creator_id);
    });
  });

  describe("functional", () => {
    it("fetches and sets trail and creator data on mount", async () => {
      render(<HikeComponent hikeType="new" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        expect(fetchTrailById).toHaveBeenCalledWith(MOCK_HIKE.trail_id);
        expect(fetchUserById).toHaveBeenCalledWith(MOCK_HIKE.creator_id);
        expect(convertDate).toHaveBeenCalledWith(MOCK_HIKE.date);
        expect(convertTime).toHaveBeenCalledWith(MOCK_HIKE.time);
      });
    });

    it("adds participant when 'Join Hike' is clicked", async () => {
      render(<HikeComponent hikeType="available" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        const button = screen.getByRole("button", { name: /join hike/i });
        expect(button).toBeInTheDocument();
      });
      const button = screen.getByRole("button", { name: /join hike/i });
      await userEvent.click(button);
      expect(addParticipant).toHaveBeenCalledWith(MOCK_USER.id, MOCK_HIKE.id);
    });

    it("removes participant when 'Opt Out' is clicked", async () => {
      render(<HikeComponent hikeType="joined" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        const button = screen.getByRole("button", { name: /opt out/i });
        expect(button).toBeInTheDocument();
      });
      const button = screen.getByRole("button", { name: /opt out/i });
      await userEvent.click(button);
      expect(removeParticipant).toHaveBeenCalledWith(MOCK_USER.id, MOCK_HIKE.id);
    });
    
    it("redirects to edit-hike when 'Edit Hike' is clicked", async () => {
      render(<HikeComponent hikeType="created" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        const button = screen.getByRole("button", { name: /edit hike/i });
        expect(button).toBeInTheDocument();
      });
      const button = screen.getByRole("button", { name: /edit hike/i });
      await userEvent.click(button);
      expect(mockSetHike).toHaveBeenCalledWith(MOCK_HIKE.id);
      expect(mockRouterPush).toHaveBeenCalledWith("/edit-hike");
    });
  });
});
