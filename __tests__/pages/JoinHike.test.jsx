import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react"; 
import JoinHike from "@/app/(dashboard)/join-hike/page";
import { useGlobal } from "@/app/context/GlobalContext";
import { fetchHikesToJoin } from "@/app/hooks/fetchHikesToJoin";

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("@/app/hooks/fetchHikesToJoin", () => ({
  fetchHikesToJoin: jest.fn(),
}));

jest.mock("@/app/ui/components/HikeComponent", () => {
  return () => {
    return (
      <div data-testid="hike-component">
        
      </div>
    );
  };
});

describe("JoinHike", () => {
  let mockCurrentUser, mockSetCurrentUser, mockSetTriggerRefresh;

  beforeEach(() => {
    mockCurrentUser = {
      id: 2,
      user_name: "Test User",
      bio: "Test Bio",
      avatar: "",
    };
    mockSetCurrentUser = jest.fn();
    mockSetTriggerRefresh = jest.fn();
  
    useGlobal.mockReturnValue({
      currentUser: mockCurrentUser,
      setCurrentUser: mockSetCurrentUser,
      setTriggerRefresh: mockSetTriggerRefresh
    });

    fetchHikesToJoin.mockReturnValue([
      {
        id: 5,
        title: "Sunset Hike",
        date: "2024-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
        status: "new",
        creator_id: 1
      }
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a JoinHike component", () => {
      render(<JoinHike />);
      expect(screen.getByText(/Select a hike you would like to join:/i)).toBeInTheDocument();
    });

    it("renders HikeComponent for each hike in hikeList", async () => {
      render(<JoinHike />);
      await screen.findAllByTestId("hike-component");
      expect(screen.getAllByTestId("hike-component")).toHaveLength(1);
    });
  });

  describe("functional", () => {
    it("refetches hikes when triggerRefresh is true", async () => {
      const { rerender } = render(<JoinHike />);
      // First fetch
      await screen.findAllByTestId("hike-component");
      expect(fetchHikesToJoin).toHaveBeenCalledTimes(1);
      // Simulate setting triggerRefresh to true
      useGlobal.mockReturnValueOnce({
        ...useGlobal(),
        triggerRefresh: true,
      });
      rerender(<JoinHike />);
      // Second fetch
      await screen.findAllByTestId("hike-component");
      expect(fetchHikesToJoin).toHaveBeenCalledTimes(2);
    });
  });
});
