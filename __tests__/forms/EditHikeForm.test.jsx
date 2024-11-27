import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditHikeForm from "@/app/ui/forms/EditHikeForm";
import { useModal } from "@/app/context/ModalContext";

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

let showModalMock;

  beforeEach(() => {
    showModalMock = jest.fn();
    useModal.mockReturnValue({ showModal: showModalMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

describe("EditHikeForm", () => {
  describe("rendering", () => {
    it("renders form fields with initial hikeInfo values", () => {
      const hikeInfo = {
        title: "Sunset Hike",
        date: "2024-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
      };
      render(<EditHikeForm hikeInfo={hikeInfo} />);
      expect(screen.getByLabelText(/title/i)).toHaveValue(hikeInfo.title);
      expect(screen.getByLabelText(/date/i)).toHaveValue(hikeInfo.date);
      expect(screen.getByLabelText(/time/i)).toHaveValue(hikeInfo.time);
      expect(screen.getByLabelText(/location/i)).toHaveValue(hikeInfo.location);
      expect(screen.getByLabelText(/comments/i)).toHaveValue(hikeInfo.comments);
    });

    it("handles empty hikeInfo gracefully", () => {
      render(<EditHikeForm hikeInfo={{}} />);
      expect(screen.getByLabelText(/title/i)).toHaveValue("");
      expect(screen.getByLabelText(/date/i)).toHaveValue("");
      expect(screen.getByLabelText(/time/i)).toHaveValue("");
      expect(screen.getByLabelText(/location/i)).toHaveValue("");
      expect(screen.getByLabelText(/comments/i)).toHaveValue("");
    });
  });

  describe("functional", () => {
    it("does not throw when onSubmit is not provided", async () => {
      render(<EditHikeForm />);
      const button = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(button);
    });

    it("does not throw when handleCancel is not provided", async () => {
      render(<EditHikeForm />);
      const cancelButton = screen.getByRole("button", { name: /cancel hike/i });
      await userEvent.click(cancelButton);
    });

    it("does not throw when handleDiscard is not provided", async () => {
      render(<EditHikeForm />);
      const discardButton = screen.getByRole("button", { name: /discard changes/i });
      await userEvent.click(discardButton);
    });

    it("calls onChange when form fields are updated", async () => {
      const onChangeMock = jest.fn();
      const hikeInfo = {
        title: "Sunset Hike",
        date: "2024-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
      };
      render(<EditHikeForm hikeInfo={hikeInfo} onChange={onChangeMock} />);
      const titleField = screen.getByLabelText(/title/i);
      await userEvent.clear(titleField);
      await userEvent.type(titleField, "Waterfall Hike");
      expect(onChangeMock).toHaveBeenCalledTimes("Waterfall Hike".length + 1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object));
    });

    it("calls onSubmit when the form is submitted and data is present", async () => {
      const onSubmitMock = jest.fn();
      const hikeInfo = {
        title: "Sunset Hike",
        date: "2024-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
      };
      render(<EditHikeForm onSubmit={onSubmitMock} hikeInfo={hikeInfo} />);
      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(saveButton);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    it("calls handleDiscard when the reset button is clicked", async () => {
      const handleDiscardMock = jest.fn();
      render(<EditHikeForm handleDiscard={handleDiscardMock} />);
      const discardButton = screen.getByRole("button", { name: /discard changes/i });
      await userEvent.click(discardButton);
      expect(handleDiscardMock).toHaveBeenCalledTimes(1);
    });

    it("calls handleCancel when the cancel button is clicked", async () => {
      const handleCancelMock = jest.fn();
      render(<EditHikeForm handleCancel={handleCancelMock} />);
      const cancelButton = screen.getByRole("button", { name: /cancel hike/i });
      await userEvent.click(cancelButton);
      expect(handleCancelMock).toHaveBeenCalledTimes(1);
    });

    it("resets form fields to their initial values when reset button is clicked", async () => {
      const hikeInfo = {
        title: "Sunset Hike",
        date: "2024-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
      };
      render(<EditHikeForm hikeInfo={hikeInfo} />);
      const titleField = screen.getByLabelText(/title/i);
      await userEvent.clear(titleField);
      await userEvent.type(titleField, "Changed Title");
      const discardButton = screen.getByRole("button", { name: /discard changes/i });
      await userEvent.click(discardButton);
      expect(titleField).toHaveValue(hikeInfo.title);
    });

    it("does not call onSubmit if required fields are empty", async () => {
      const mockOnSubmit = jest.fn();
      render(<EditHikeForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button", { name: /save changes/i });
      const titleField = screen.getByLabelText(/title/i);
      await userEvent.clear(titleField);
      await userEvent.click(button);
      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(showModalMock).toHaveBeenCalledWith(
        "Error",
        "Please fill out all the information"
      );
    });
  });
});
