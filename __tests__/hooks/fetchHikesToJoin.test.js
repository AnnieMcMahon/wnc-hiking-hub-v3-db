import { fetchHikesByParticipant, fetchAvailableHikes } from "@/app/api/data/data";
import { fetchHikesToJoin } from "@/app/hooks/fetchHikesToJoin";

jest.mock("@/app/api/data/data", () => ({
  fetchHikesByParticipant: jest.fn(),
  fetchAvailableHikes: jest.fn(),
}));

describe("fetchHikesToJoin", () => {
  const mockUserId = 2;
  const fixedDate = "2025-01-08T19:13:20.863Z";
    global.Date = jest.fn(() => ({
      toISOString: jest.fn(() => fixedDate),
    }));
    let mockAvailableHikes = [{
      id: 5,
      title: "Sunset Hike",
      date: "2024-12-01",
      time: "18:00",
      location: "Blue Ridge Parkway",
      comments: "Bring water and snacks.",
      status: "new",
      creator_id: 2
      }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches hikes when the user has joined hikes", async () => {
    const mockHikes = [
      { hike_id: 1 },
      { hike_id: 2 },
      { hike_id: 3 },
    ];
    fetchHikesByParticipant.mockResolvedValue(mockHikes);
    fetchAvailableHikes.mockResolvedValue(mockAvailableHikes);

    const result = await fetchHikesToJoin(mockUserId);
    expect(fetchHikesByParticipant).toHaveBeenCalledWith(mockUserId);
    expect(fetchAvailableHikes).toHaveBeenCalledWith(
      mockUserId,
      fixedDate,
      "(1, 2, 3)"
    );
    expect(result).toEqual(mockAvailableHikes);
  });

  it("fetches hikes when the user has not joined any hikes", async () => {
    fetchHikesByParticipant.mockResolvedValue(null); 
    fetchAvailableHikes.mockResolvedValue(mockAvailableHikes);
    const result = await fetchHikesToJoin(mockUserId);
    expect(fetchHikesByParticipant).toHaveBeenCalledWith(mockUserId);
    expect(fetchAvailableHikes).toHaveBeenCalledWith(
      mockUserId,
      fixedDate,
      "()"
    );
    expect(result).toEqual(mockAvailableHikes);
  });

  it("formats hikeIds correctly when there is only one joined hike", async () => {
    const mockHikes = [{ hike_id: 1 }];
    fetchHikesByParticipant.mockResolvedValue(mockHikes);
    fetchAvailableHikes.mockResolvedValue(mockAvailableHikes);
    const result = await fetchHikesToJoin(mockUserId);
    expect(fetchHikesByParticipant).toHaveBeenCalledWith(mockUserId);
    expect(fetchAvailableHikes).toHaveBeenCalledWith(
      mockUserId,
      fixedDate,
      "(1)"
    );
    expect(result).toEqual(mockAvailableHikes);
  });
});