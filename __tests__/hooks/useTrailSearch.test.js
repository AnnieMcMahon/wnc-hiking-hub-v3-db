import { render, waitFor } from "@testing-library/react";
import { filterTrailList } from "@/app/hooks/filterTrailList";
import { ANY_AREA, ANY_LENGTH, ANY_DIFFICULTY } from "@/app/lib/constants";
import { useTrailSearch } from "@/app/hooks/useTrailSearch";

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

jest.mock("@/app/hooks/filterTrailList", () => ({
  filterTrailList: jest.fn(),
}));

function TestComponent({ callback }) {
  const hookResult = callback();
  return <>{JSON.stringify(hookResult)}</>;
}

describe("useTrailSearch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default search criteria and an empty list", async () => {
    filterTrailList.mockReturnValue(mockTrails);
    const { container } = render(
      <TestComponent callback={() => useTrailSearch()} />
    );
    await waitFor(() => {
      const result = JSON.parse(container.textContent);
      expect(result.searchCriteria).toEqual({
        area: ANY_AREA,
        difficulty: ANY_DIFFICULTY,
        length: ANY_LENGTH,
      });
      expect(result.filteredList).toEqual([]);
    });
  });

  it("updates filteredList when searchCriteria changes", async () => {
    filterTrailList.mockReturnValue(mockTrails[1]);
    let hookResult;
    render(
      <TestComponent
        callback={() => {
          hookResult = useTrailSearch();
          return hookResult;
        }}
      />
    );
    await waitFor(() => {
      hookResult.updateSearchCriteria("difficulty", "easy");
    });
    await waitFor(() => {
      expect(filterTrailList).toHaveBeenCalledWith(
        ANY_AREA,
        "easy",
        ANY_LENGTH
      );
      expect(hookResult.filteredList).toEqual(mockTrails[1]);
    });
  });
});
