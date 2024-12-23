import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { addTrail } from "@/app/api/data/data";
import { MOCK_USER } from "@/app/lib/constants";
import AddTrail from "@/app/(dashboard)/add-trail/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  addTrail: jest.fn(),
}));

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

let showModalMock;
let closeModalMock;

jest.mock("@/app/ui/forms/TrailForm", () => {
  return ({ onSubmit, onClick }) => {
    return (
      <div data-testid="trail-form">
        <button
          data-testid="submit-button"
          onClick={() =>
            onSubmit({
              trail_name: "Blue Ridge Trail",
              area_name: "Blue Ridge Mountains",
              difficulty_rating: "moderate",
              length: 5.4,
              elevation_gain: 1200,
              route_type: "loop",
              trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
            })
          }
        >
          Submit
        </button>
        <button data-testid="cancel-button" onClick={() => onClick()}>
          Cancel
        </button>
      </div>
    );
  };
});

describe("AddTrail", () => {
  let mockRouterPush;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    useGlobal.mockReturnValue({
      currentUser: MOCK_USER,
    });

    showModalMock = jest.fn();
    closeModalMock = jest.fn();
    useModal.mockReturnValue({
      showModal: showModalMock,
      closeModal: closeModalMock,
    });

    addTrail.mockResolvedValue({
      id: 5,
      trail_name: "Blue Ridge Trail",
      area_name: "Blue Ridge Mountains",
      difficulty_rating: "moderate",
      length: 5.4,
      elevation_gain: 1200,
      route_type: "loop",
      trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the AddTrail and TrailForm components", async () => {
      render(<AddTrail />);
      await waitFor(() => {
        expect(screen.getByTestId("trail-form")).toBeInTheDocument();
      });
    });
  });

  describe("functionality", () => {
    it("navigates to /post-hike after clicking the Cancel button", async () => {
      render(<AddTrail />);
      await waitFor(() => {
        const cancelButton = screen.getByTestId("cancel-button");
        cancelButton.click();
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/post-hike");
    });

    it("shows a success modal after a trail is submitted", async () => {
      render(<AddTrail />);
      await waitFor(() => {
        const submitButton = screen.getByTestId("submit-button");
        submitButton.click();
      });
      expect(showModalMock).toHaveBeenCalledWith(
        "Save Changes",
        "Changes have been saved successfully!",
        null,
        expect.any(Function)
      );
    });

    it("calls closeModal and redirects to /post-hike when the modal's callback is executed", async () => {
      render(<AddTrail />);
      await waitFor(() => {
        const submitButton = screen.getByTestId("submit-button");
        submitButton.click();
      });
      expect(showModalMock).toHaveBeenCalledWith(
        "Save Changes",
        "Changes have been saved successfully!",
        null,
        expect.any(Function)
      );
      const modalCallback = showModalMock.mock.calls[0][3];
      modalCallback();
      const { closeModal } = useModal();
      expect(closeModal).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/post-hike");
    });

    it("calls addTrail API with the correct data when a trail is submitted", async () => {
      render(<AddTrail />);
      await waitFor(() => {
        const submitButton = screen.getByTestId("submit-button");
        submitButton.click();
      });
      const newTrail = {
        trail_name: "Blue Ridge Trail",
        area_name: "Blue Ridge Mountains",
        difficulty_rating: "moderate",
        length: 5.4,
        elevation_gain: 1200,
        route_type: "loop",
        trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
      };
      await waitFor(() => {
        expect(addTrail).toHaveBeenCalledWith(newTrail);
      });
    });

    it("shows an error modal if addTrail fails", async () => {
      const errorMessage = "Failed to add new trail.";
      addTrail.mockRejectedValue(new Error(errorMessage));
      render(<AddTrail />);
      await waitFor(() => {
        const submitButton = screen.getByTestId("submit-button");
        submitButton.click();
      });
      expect(showModalMock).toHaveBeenCalledWith(
        "Error adding the trail",
        "Make sure the trail is not already on the list.",
        null,
        expect.any(Function)
      );
    });
  });
});
