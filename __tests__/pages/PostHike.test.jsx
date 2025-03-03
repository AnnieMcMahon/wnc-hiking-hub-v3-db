import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PostHike from "@/app/(dashboard)/post-hike/page";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";
import { useTrailSearch } from "@/app/hooks/useTrailSearch";
import { addHike, addParticipant } from "@/app/api/data/data";


let hikeInfo = {
  id: 5,
  title: "Sunset Hike",
  date: "Wed, 12/01/2024",
  time: "6:00 PM",
  location: "Blue Ridge Parkway",
  comments: "Bring water and snacks.",
  status: "new",
  creator_id: 1,
  creator: "Annie McMahon",
  buttonMessage: "Join Hike",
};

let chosenTrail = null;

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

jest.mock("@/app/hooks/useTrailSearch", () => ({
  useTrailSearch: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  addHike: jest.fn(),
  addParticipant: jest.fn(),
}));

jest.mock("@/app/ui/components/ChosenTrail", () => {
  return ({ trailSelected }) => {
    return (
      <div data-testid="chosen-trail-component">
        {trailSelected ? `Trail Selected: ${trailSelected}` : "No Trail Selected"}
      </div>
    );
  };
});

jest.mock("@/app/ui/forms/SearchForm", () => {
  return ({ onSearch }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      onSearch(name, value);
    };

    return (
      <div>
        <input
          data-testid="search-input"
          name="difficulty"
          onChange={handleChange}
        />
      </div>
    );
  };
});

jest.mock("@/app/ui/forms/HikeForm", () => {
  return ({ onSubmit }) => {
    const handleSubmit = () => {
      onSubmit(hikeInfo);
    };
    return (
      <div data-testid="hike-form-component" onSubmit={handleSubmit}></div>
    );
  };
});

jest.mock("@/app/ui/components/TrailPost", () => {
  return ({ onClick }) => {
    const handleClick = () => {
      chosenTrail = 2;
      onClick(chosenTrail);
    };
    return <div data-testid="trail-post-component" onClick={handleClick}></div>;
  };
});

describe("PostHike", () => {
  let mockRouterPush;
  let showModalMock;
  let closeModalMock;

  beforeEach(() => {
    useGlobal.mockReturnValue({
      currentUser: { id: 2 }
    });

    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    showModalMock = jest.fn();
    closeModalMock = jest.fn();
    useModal.mockReturnValue({
      showModal: showModalMock,
      closeModal: closeModalMock,
    });

    useTrailSearch.mockReturnValue({
      searchCriteria: {
        area: "Blue Ridge Parkway",
        difficulty: "moderate",
        length: "From 3 to 6 miles",
      },
      filteredList: [
        {
          id: 5,
          trail_name: "Blue Ridge Trail",
          area_name: "Blue Ridge Parkway",
          difficulty_rating: "moderate",
          length: 5.4,
          elevation_gain: 1200,
          route_type: "loop",
          trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
        },
      ],
      updateSearchCriteria: jest.fn(),
    });

    addHike.mockReturnValue([hikeInfo]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a PostHike component", () => {
      render(<PostHike />);
      expect(screen.getByText(/1. Search for a trail/i)).toBeInTheDocument();
    });

    it("renders trail posts for each item in the filtered list", () => {
      render(<PostHike />);
      const trailPosts = screen.getAllByTestId("trail-post-component");
      expect(trailPosts.length).toBe(
        useTrailSearch.mock.results[0].value.filteredList.length
      );
    });
  });

  describe("functional", () => {
    it("displays an error modal if no trail is chosen during submission", async () => {
      render(<PostHike />);
      const hikeForm = screen.getByTestId("hike-form-component");
      fireEvent.submit(hikeForm);
      await waitFor(() => {
        expect(showModalMock).toHaveBeenCalledWith(
          "Error",
          "Please choose a trail"
        );
      });
    });

    it("updates search criteria when the search form is used", () => {
      render(<PostHike />);
      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, {
        target: { name: "difficulty", value: "easy" },
      });
      expect(
        useTrailSearch.mock.results[0].value.updateSearchCriteria
      ).toHaveBeenCalledWith("difficulty", "easy");
    });

    it("shows a demo mode modal and redirects when the user is a demo user", async () => {
      useGlobal.mockReturnValue({
        currentUser: { id: 1 }
      });
      render(<PostHike />);
      const trailPost = screen.getByTestId("trail-post-component");
      fireEvent.click(trailPost);
      const hikeForm = screen.getByTestId("hike-form-component");
      fireEvent.submit(hikeForm);
      await waitFor(() => {
        expect(showModalMock).toHaveBeenCalledWith(
          "Demo",
          "Demo Mode - new hike cannot be posted."
        );
        expect(mockRouterPush).toHaveBeenCalledWith("/bio/1");
      });
    });    

    it("adds the hike and redirects when a valid hike is submitted", async () => {
      render(<PostHike />);
      const filteredList = useTrailSearch.mock.results[0].value.filteredList;

      const trailPost = screen.getByTestId("trail-post-component");
      fireEvent.click(trailPost);
      const hikeForm = screen.getByTestId("hike-form-component");
      fireEvent.submit(hikeForm);
  
      await waitFor(() => {
        expect(addHike).toHaveBeenCalledWith({
          ...hikeInfo,
          creator_id: 2,
          trail_id: filteredList[0].id,
          status: "new",
        });
        expect(addParticipant).toHaveBeenCalledWith(2, 5);
        expect(mockRouterPush).toHaveBeenCalledWith("/bio/2");
      });
    });
  });
});
