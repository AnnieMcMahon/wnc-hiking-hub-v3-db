import { fetchUserHikes } from "@/app/hooks/fetchUserHikes";
import { fetchHikesByParticipant, fetchHikeById } from "@/app/api/data/data";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import MockDate from "mockdate";

jest.mock("@/app/api/data/data", () => ({
  fetchHikesByParticipant: jest.fn(),
  fetchHikeById: jest.fn(),
}));

dayjs.extend(utc);
dayjs.extend(timezone);

describe("fetchUserHikes", () => {
  const mockUserId = 1;
  const mockCurrentDate = "2025-01-08";
  const mockHikes = [
    {
      id: 1,
      title: "Sunset Hike",
      date: "2025-01-07",
      time: "18:00",
      location: "Blue Ridge Parkway",
      comments: "Bring water and snacks.",
      status: "new",
      creator_id: 1
    },
    {
      id: 2,
      title: "Sunset Hike",
      date: "2025-01-09",
      time: "18:00",
      location: "Blue Ridge Parkway",
      comments: "Bring water and snacks.",
      status: "new",
      creator_id: 2
    },
    {
      id: 3,
      title: "Sunset Hike",
      date: "2025-01-05",
      time: "18:00",
      location: "Blue Ridge Parkway",
      comments: "Bring water and snacks.",
      status: "new",
      creator_id: 1
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    MockDate.set(mockCurrentDate);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("returns empty lists if the user has no hikes", async () => {
    fetchHikesByParticipant.mockResolvedValue(null); 
    const result = await fetchUserHikes(mockUserId);
    expect(result.upcomingHikes).toEqual([]);
    expect(result.pastHikes).toEqual([]);
    expect(result.createdHikes).toEqual([]);
  });

  it("categorizes hikes into upcoming, past, and created hikes", async () => {

    fetchHikesByParticipant.mockResolvedValue([2]);
    fetchHikeById.mockResolvedValue([mockHikes[1]]);
    let result = await fetchUserHikes(mockUserId);
    const upcomingHikes = result.upcomingHikes;
    expect(upcomingHikes[0].id).toEqual(2);

    fetchHikesByParticipant.mockResolvedValue([3]);
    fetchHikeById.mockResolvedValue([mockHikes[2]]);
    result = await fetchUserHikes(mockUserId);
    const pastHikes = result.pastHikes;
    expect(pastHikes[0].id).toEqual(3);
    
    fetchHikesByParticipant.mockResolvedValue([1]);
    fetchHikeById.mockResolvedValue([mockHikes[0]]);
    result = await fetchUserHikes(mockUserId);
    const createdHikes = result.createdHikes;
    expect(createdHikes[0]).toEqual(1); 
  });
});

