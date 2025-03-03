import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";
import { updateHike, fetchHikeById } from "@/app/api/data/data";
import { fetchUserHikes } from "@/app/hooks/fetchUserHikes";
import EditHike from "@/app/(dashboard)/edit-hike/page";

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

let showModalMock;
let closeModalMock;

jest.mock("@/app/api/data/data", () => ({
  updateHike: jest.fn(),
  fetchHikeById: jest.fn(),
}));

jest.mock("@/app/hooks/fetchUserHikes", () => ({
  fetchUserHikes: jest.fn(),
}));

jest.mock("@/app/ui/forms/EditHikeForm", () => {
  return (props) => {
    const { hikeInfo, onSubmit, onChange, handleCancel, handleDiscard } = props;
    return (
      <form
        data-testid="edit-hike-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(hikeInfo);
        }}
      >
        <label htmlFor="newTitle">Title: </label>
        <input
          type="text"
          name="title"
          id="newTitle"
          value={hikeInfo.title}
          onChange={onChange}
          data-testid="title-input"
        />
        <br />

        <label htmlFor="newDate">Date: </label>
        <input
          type="date"
          name="date"
          id="newDate"
          min="2024-12-01"
          value={hikeInfo.date}
          onChange={onChange}
          data-testid="date-input"
        />
        <br />

        <label htmlFor="newTime"> Time: </label>
        <input
          type="time"
          name="time"
          id="newTime"
          value={hikeInfo.time}
          onChange={onChange}
          data-testid="time-input"
        />
        <br />

        <label htmlFor="newLocation"> Location: </label>
        <input
          type="text"
          name="location"
          id="newLocation"
          value={hikeInfo.location}
          onChange={onChange}
          data-testid="location-input"
        />
        <br />

        <label htmlFor="newComments">Comments: </label>
        <br />
        <textarea
          type="textarea"
          name="comments"
          id="newComments"
          value={hikeInfo.comments}
          data-gramm="false"
          onChange={onChange}
          data-testid="comment-input"
        />
        <br />
        <button
          type="submit"
          className="form-button"
          data-testid="save-button"
        >
          Save Changes
        </button>
        <button
          type="reset"
          onClick={handleDiscard}
          className="form-button"
          data-testid="discard-button"
        >
          Discard Changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="form-button"
          data-testid="cancel-button"
        >
          Cancel Hike
        </button>
      </form>
    );
  };
});

describe("EditHike", () => {
  let mockRouterPush;
  let mockHike;
  let mockCurrentUser;
  let mockHikeInfo;

  beforeEach(() => {
    mockHike = 3;
    mockHikeInfo = {
      id: 5,
      title: "Sunset Hike",
      date: "2024-12-01",
      time: "18:00",
      location: "Blue Ridge Parkway",
      comments: "Bring water and snacks.",
      status: "new",
      creator_id: 1
    }
    mockCurrentUser = {
      id: 2,
      user_name: "Test User",
      bio: "Test Bio",
      avatar: "",
    };
 
    useGlobal.mockReturnValue({
      hike: mockHike,
      currentUser: mockCurrentUser,
    });

    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    showModalMock = jest.fn();
    closeModalMock = jest.fn();
    useModal.mockReturnValue({
      showModal: showModalMock,
      closeModal: closeModalMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the EditHike and EditHikeForm components", async () => {
      render(<EditHike />);
      await waitFor(() => {
        expect(screen.getByTestId("edit-hike-form")).toBeInTheDocument();
      });
    });
  });

  describe("functional", () => {
    it("navigates to /bio after clicking the Discard button", async () => {
      render(<EditHike />);
      await waitFor(() => {
        const discardButton = screen.getByTestId("discard-button");
        discardButton.click();
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/bio/2");
    });

    it("submits the form and updates the hike info", async () => {
      render(<EditHike />);
      await waitFor(() => {
        const titleInput = screen.getByTestId("title-input");
        const dateInput = screen.getByTestId("date-input");
        const timeInput = screen.getByTestId("time-input");
        const locationInput = screen.getByTestId("location-input");
        const commentInput = screen.getByTestId("comment-input");
        const saveButton = screen.getByTestId("save-button");

        fireEvent.change(titleInput, { target: { value: "New Title" } });
        fireEvent.change(dateInput, { target: { value: "2024-12-10" } });
        fireEvent.change(timeInput, { target: { value: "10:30" } });
        fireEvent.change(locationInput, { target: { value: "New Location" } });
        fireEvent.change(commentInput, { target: { value: "New Comment" } });
        fireEvent.click(saveButton);
      });
      expect(updateHike).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 0,
          creator_id: 0,
          title: "New Title",
          date: "2024-12-10",
          time: "10:30",
          location: "New Location",
          comments: "New Comment",
          status: "updated"
        })
      );
      expect(showModalMock).toHaveBeenCalledWith(
        "Save Changes",
        "Changes have been saved successfully!",
        null,
        expect.any(Function)
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/bio/2");
    });

    it("cancels the hike if the Cancel button is clicked", async () => {
      render(<EditHike hikeInfo={mockHikeInfo}/>);
      await waitFor(() => {
        const cancelButton = screen.getByTestId("cancel-button");
        fireEvent.click(cancelButton);
      });
      expect(showModalMock).toHaveBeenCalledWith(
        "Cancel Hike",
        "Press OK to cancel this hike (cannot be reversed)",
        expect.any(Function)
      );
      const modalCallback = showModalMock.mock.calls[0][2];
      modalCallback();
      expect(updateHike).toHaveBeenCalled();

    });
  });
});
