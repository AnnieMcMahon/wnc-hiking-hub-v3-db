import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import {
  fetchTrailById,
  fetchUserById,
  fetchParticipantsByHike,
  addParticipant,
  removeParticipant,
  fetchCommentsByHike,
} from "@/app/api/data/data";
import { convertDate, convertTime } from "@/app/lib/utils";
import {
  MOCK_HIKE,
  MOCK_USER,
  MOCK_TRAIL_INFO,
  MOCK_PARTY_MBR,
  MOCK_PARTY_TBL,
} from "@/app/lib/constants";
import HikeComponent from "@/app/ui/components/HikeComponent";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

jest.mock("@/app/lib/utils", () => ({
  convertDate: jest.fn(),
  convertTime: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  fetchTrailById: jest.fn(),
  fetchUserById: jest.fn(),
  fetchParticipantsByHike: jest.fn(),
  addParticipant: jest.fn(),
  removeParticipant: jest.fn(),
  fetchCommentsByHike: jest.fn(),
}));

jest.mock("@/app/ui/components/AddComment", () => ({
  __esModule: true,
  AddComment: () => <div data-testid="mock-add-comment">Mock Add Comment</div>,
}));

jest.mock("@/app/ui/components/Comments", () => ({
  __esModule: true,
  Comments: () => <div data-testid="mock-comments">Mock Comments</div>,
}));

fetchUserById.mockImplementation((id) => {
  return Promise.resolve([{ user_name: `User${id}`, avatar: `avatar${id}.png` }]);
});

describe("HikeComponent", () => {
  let mockSetTriggerRefresh, mockRouterPush, mockSetHike, mockShowModal, mockCloseModal;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    mockSetHike = jest.fn();
    mockSetTriggerRefresh = jest.fn();
    mockShowModal = jest.fn();
    mockCloseModal = jest.fn();

    useGlobal.mockReturnValue({
      currentUser: MOCK_USER,
      setHike: mockSetHike,
      setTriggerRefresh: mockSetTriggerRefresh,
    });

    useModal.mockReturnValue({
      showModal: mockShowModal,
      closeModal: mockCloseModal,
    });

    convertDate.mockReturnValue("12/01/2024");
    convertTime.mockReturnValue("10:00 AM");

    fetchTrailById.mockResolvedValue([MOCK_TRAIL_INFO]);
    // fetchUserById.mockResolvedValueOnce([MOCK_USER])
    // fetchUserById.mockResolvedValueOnce([MOCK_PARTY_MBR]);
    fetchUserById.mockImplementation((id) => {
      if (id === MOCK_HIKE.creator_id) return Promise.resolve([MOCK_USER]);
      return Promise.resolve([MOCK_PARTY_MBR]);
    });
    
    fetchParticipantsByHike.mockResolvedValue([MOCK_PARTY_TBL]);
    fetchCommentsByHike.mockResolvedValue([]);
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
      expect(fetchUserById).toHaveBeenCalledTimes(2);
      expect(fetchParticipantsByHike).toHaveBeenCalledWith(MOCK_HIKE.id);
    });

    it("displays the correct button message based on hike type", async () => {
      render(<HikeComponent hikeType="joined" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        expect(screen.getByText(/opt out/i)).toBeInTheDocument();
      });
    
      render(<HikeComponent hikeType="created" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        expect(screen.getByText(/edit hike/i)).toBeInTheDocument();
      });
    
      render(<HikeComponent hikeType="available" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        expect(screen.getByText(/join hike/i)).toBeInTheDocument();
      });
    });
  });

  describe("functional", () => {
    it("calls addParticipant when 'Join Hike' button is clicked", async () => {
      render(<HikeComponent hikeType="available" hikeInfo={MOCK_HIKE} />);
      const joinButton = await screen.findByText(/join hike/i);
      userEvent.click(joinButton);
      await waitFor(() => {
        expect(addParticipant).toHaveBeenCalledWith(MOCK_USER.id, MOCK_HIKE.id);
        expect(mockSetTriggerRefresh).toHaveBeenCalledWith(true);
      });
    });
    
    it("calls removeParticipant when 'Opt Out' button is clicked", async () => {
      render(<HikeComponent hikeType="joined" hikeInfo={MOCK_HIKE} />);
      const optOutButton = await screen.findByText(/opt out/i);
      userEvent.click(optOutButton);
      await waitFor(() => {
        expect(removeParticipant).toHaveBeenCalledWith(MOCK_USER.id, MOCK_HIKE.id);
        expect(mockSetTriggerRefresh).toHaveBeenCalledWith(true);
      });
    });
    
    it("navigates to edit hike page when 'Edit Hike' is clicked", async () => {
      render(<HikeComponent hikeType="created" hikeInfo={MOCK_HIKE} />);
      const editButton = await screen.findByText(/edit hike/i);
    
      userEvent.click(editButton);
      await waitFor(() => {
        expect(mockSetHike).toHaveBeenCalledWith(MOCK_HIKE.id);
        expect(mockRouterPush).toHaveBeenCalledWith("/edit-hike");
      });
    });

    it("opens the modal with participant info when participant button is clicked", async () => {
      render(<HikeComponent hikeType="joined" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        expect(fetchParticipantsByHike).toHaveBeenCalledWith(MOCK_HIKE.id);
      });
      const participantButton = await screen.findByText(/participant/i);
    
      userEvent.click(participantButton);
      await waitFor(() => {
        expect(mockShowModal).toHaveBeenCalledTimes(1);
      });
    });
    
    it("fetches trail, creator, and participants on mount", async () => {
      render(<HikeComponent hikeType="joined" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        expect(fetchTrailById).toHaveBeenCalledWith(MOCK_HIKE.trail_id);
        expect(fetchUserById).toHaveBeenCalledTimes(2);
        expect(fetchParticipantsByHike).toHaveBeenCalledWith(MOCK_HIKE.id);
      });
    });
  });
});
