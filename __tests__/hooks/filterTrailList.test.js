import {
  ANY_AREA,
  ANY_DIFFICULTY,
  ANY_LENGTH,
  SHORT,
  MEDIUM,
  LONG
} from "@/app/lib/constants";
import { filterTrailList } from "@/app/hooks/filterTrailList";
import { fetchAllTrails } from "@/app/api/data/data";

const mockTrails = [
  {
    id: 5,
    trail_name: "Blue Ridge Trail",
    area_name: "Blue Ridge Mountains",
    difficulty_rating: "moderate",
    length: 5.4,
    elevation_gain: 1200,
    route_type: "loop",
    trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
  },
  {
    id: 6,
    trail_name: "Red Trail",
    area_name: "Blue Ridge Mountains",
    difficulty_rating: "easy",
    length: 2.4,
    elevation_gain: 1200,
    route_type: "loop",
    trail_link: "some-link",
  },
];

jest.mock("@/app/api/data/data", () => ({
  fetchAllTrails: jest.fn(), 
}));

fetchAllTrails.mockResolvedValue(mockTrails);

describe("filterTrailList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all trails when no filters are applied", async () => {
    const result = await filterTrailList(ANY_AREA, ANY_DIFFICULTY, ANY_LENGTH);
    expect(result).toEqual(mockTrails);
  });

  it("filters trails by area name", async () => {
    const result = await filterTrailList("Blue Ridge Mountains", ANY_DIFFICULTY, ANY_LENGTH);
    expect(result).toEqual(mockTrails);
  });

  it("filters trails by difficulty rating", async () => {
    const result = await filterTrailList(ANY_AREA, "easy", ANY_LENGTH);
    expect(result).toEqual([mockTrails[1]]);
  });

  it("filters trails by length (SHORT)", async () => {
    const result = await filterTrailList(ANY_AREA, ANY_DIFFICULTY, SHORT);
    expect(result).toEqual([mockTrails[1]]); 
  });

  it("filters trails by length (MEDIUM)", async () => {
    const result = await filterTrailList(ANY_AREA, ANY_DIFFICULTY, MEDIUM);
    expect(result).toEqual([mockTrails[0]]); 
  });

  it("filters trails by length (LONG)", async () => {
    const longTrail = {
      id: 7,
      trail_name: "Long Trail",
      area_name: "Smoky Mountains",
      difficulty_rating: "hard",
      length: 7.5,
      elevation_gain: 2000,
      route_type: "out-and-back",
      trail_link: "some-long-trail-link",
    };
    fetchAllTrails.mockResolvedValueOnce([...mockTrails, longTrail]);

    const result = await filterTrailList(ANY_AREA, ANY_DIFFICULTY, LONG);
    expect(result).toEqual([longTrail]);
  });

  it("filters trails by a combination of area and difficulty", async () => {
    const result = await filterTrailList("Blue Ridge Mountains", "easy", ANY_LENGTH);
    expect(result).toEqual([mockTrails[1]]);
  });

  it("returns an empty list when no trails match the filters", async () => {
    const result = await filterTrailList("Nonexistent Area", ANY_DIFFICULTY, ANY_LENGTH);
    expect(result).toEqual([]);
  });
});
