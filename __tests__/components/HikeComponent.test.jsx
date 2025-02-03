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
} from "@/app/api/data/data";
import { convertDate, convertTime } from "@/app/lib/utils";
import {
  MOCK_HIKE,
  MOCK_USER,
  MOCK_TRAIL_INFO,
  MOCK_PARTY_MBR,
  MOCK_PARTY_TBL,
  MOCK_NAMES_AVATARS
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
}));

describe("HikeComponent", () => {
  let mockRouterPush, mockSetHike, mockShowModal, mockCloseModal;

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
    fetchUserById.mockResolvedValueOnce([MOCK_USER])
                  .mockResolvedValueOnce([MOCK_USER])
                  .mockResolvedValueOnce([MOCK_PARTY_MBR]);
    fetchParticipantsByHike.mockResolvedValue([MOCK_PARTY_TBL]);
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
      expect(fetchUserById).toHaveBeenCalledTimes(3);
      expect(fetchUserById).toHaveBeenCalledWith(...[
        MOCK_HIKE.creator_id,
        ...MOCK_PARTY_TBL.map(o => o.user_id)
      ]);
      expect(fetchParticipantsByHike).toHaveBeenCalledWith(MOCK_HIKE.id);
    });
  });

  describe("functional", () => {
    it("fetches and sets trail and creator data on mount", async () => {
      render(<HikeComponent hikeType="new" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        expect(fetchTrailById).toHaveBeenCalledWith(MOCK_HIKE.trail_id);
        expect(fetchUserById).toHaveBeenCalledTimes(3);
        expect(fetchUserById).toHaveBeenCalledWith(...[
          MOCK_HIKE.creator_id,
          ...MOCK_PARTY_TBL.map(o => o.user_id)
        ]);
        expect(fetchParticipantsByHike).toHaveBeenCalledWith(MOCK_HIKE.id);
        expect(convertDate).toHaveBeenCalledWith(MOCK_HIKE.date);
        expect(convertTime).toHaveBeenCalledWith(MOCK_HIKE.time);
      });
    });

    const ADDS = "adds participant when 'Join Hike' is clicked";
    const REMOVES = "removes participant when 'Opt Out' is clicked";
    const REDIRECTS = "removes participant when 'Opt Out' is clicked";
    const AND_OVERLAYS = " opens a modal when '# participants' is clicked";
    const partyCount = MOCK_PARTY_TBL.length;
    const partyExp = new RegExp(partyCount + " " + "participant" + "s?");

    it(ADDS + AND_OVERLAYS, async () => {
      render(<HikeComponent hikeType="available" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        const button1 = screen.getByRole("button", { name: /join hike/i });
        const button2 = screen.getByRole("button", { name: partyExp });
        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();
      });
      const button1 = screen.getByRole("button", { name: /join hike/i });
      const button2 = screen.getByRole("button", { name: partyExp });
      await userEvent.click(button1);
      await userEvent.click(button2);
      expect(addParticipant).toHaveBeenCalledWith(MOCK_USER.id, MOCK_HIKE.id);
      expect(mockShowModal).toHaveBeenCalledWith(...[
        MOCK_HIKE.title,
        MOCK_NAMES_AVATARS,
        null,
        mockCloseModal,
      ]);
    });

    it(REMOVES + AND_OVERLAYS, async () => {
      render(<HikeComponent hikeType="joined" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        const button1 = screen.getByRole("button", { name: /opt out/i });
        const button2 = screen.getByRole("button", { name: partyExp });
        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();
      });
      const button1 = screen.getByRole("button", { name: /opt out/i });
      const button2 = screen.getByRole("button", { name: partyExp });
      await userEvent.click(button1);
      await userEvent.click(button2);
      expect(removeParticipant).toHaveBeenCalledWith(MOCK_USER.id, MOCK_HIKE.id);
      expect(mockShowModal).toHaveBeenCalledWith(...[
        MOCK_HIKE.title,
        MOCK_NAMES_AVATARS,
        null,
        mockCloseModal,
      ]);
    });
    
    it(REDIRECTS + AND_OVERLAYS, async () => {
      render(<HikeComponent hikeType="created" hikeInfo={MOCK_HIKE} />);
      await waitFor(() => {
        const button1 = screen.getByRole("button", { name: /edit hike/i });
        const button2 = screen.getByRole("button", { name: partyExp });
        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();
      });
      const button1 = screen.getByRole("button", { name: /edit hike/i });
      const button2 = screen.getByRole("button", { name: partyExp });
      await userEvent.click(button2);
      expect(mockShowModal).toHaveBeenCalledWith(...[
        MOCK_HIKE.title,
        MOCK_NAMES_AVATARS,
        null,
        mockCloseModal,
      ]);
      await userEvent.click(button1);
      expect(mockSetHike).toHaveBeenCalledWith(MOCK_HIKE.id);
      expect(mockRouterPush).toHaveBeenCalledWith("/edit-hike");
    });
  });
});
