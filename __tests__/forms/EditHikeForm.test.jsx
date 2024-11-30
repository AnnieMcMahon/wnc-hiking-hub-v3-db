import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditHikeForm from "@/app/ui/forms/EditHikeForm";
import { MOCK_HIKE } from "@/app/lib/constants";
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
    it("renders form fields with initial MOCK_HIKE values", () => {
      render(<EditHikeForm hikeInfo={MOCK_HIKE} />);
      expect(screen.getByLabelText(/title/i)).toHaveValue(MOCK_HIKE.title);
      expect(screen.getByLabelText(/date/i)).toHaveValue(MOCK_HIKE.date);
      expect(screen.getByLabelText(/time/i)).toHaveValue(MOCK_HIKE.time);
      expect(screen.getByLabelText(/location/i)).toHaveValue(MOCK_HIKE.location);
      expect(screen.getByLabelText(/comments/i)).toHaveValue(MOCK_HIKE.comments);
    });

    it("handles empty MOCK_HIKE gracefully", () => {
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
      const button = screen.getByRole("button", { name: /cancel hike/i });
      await userEvent.click(button);
    });

    it("does not throw when handleDiscard is not provided", async () => {
      render(<EditHikeForm />);
      const button = screen.getByRole("button", { name: /discard changes/i });
      await userEvent.click(button);
    });

    it("calls onChange when form fields are updated", async () => {
      const onChangeMock = jest.fn();
      const MOCK_HIKE = {
        title: "Sunset Hike",
        date: "2025-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
      };
      render(<EditHikeForm hikeInfo={MOCK_HIKE} onChange={onChangeMock} />);
      const titleField = screen.getByLabelText(/title/i);
      await userEvent.clear(titleField);
      await userEvent.type(titleField, "Waterfall Hike");
      expect(onChangeMock).toHaveBeenCalledTimes("Waterfall Hike".length + 1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object));
    });

    it("does not call onSubmit when the date is earlier than today", async () => {
      const onSubmitMock = jest.fn();
      const MOCK_HIKE = {
        title: "Sunset Hike",
        date: "2020-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
      };
      render(<EditHikeForm onSubmit={onSubmitMock} hikeInfo={MOCK_HIKE} />);
      const button = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(button);
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("calls onSubmit when the form is submitted and data is present", async () => {
      const onSubmitMock = jest.fn();
      const MOCK_HIKE = {
        title: "Sunset Hike",
        date: "2025-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
      };
      render(<EditHikeForm onSubmit={onSubmitMock} hikeInfo={MOCK_HIKE} />);
      const button = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(button);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    it("calls handleDiscard when the reset button is clicked", async () => {
      const handleDiscardMock = jest.fn();
      render(<EditHikeForm handleDiscard={handleDiscardMock} />);
      const button = screen.getByRole("button", { name: /discard changes/i });
      await userEvent.click(button);
      expect(handleDiscardMock).toHaveBeenCalledTimes(1);
    });

    it("calls handleCancel when the cancel button is clicked", async () => {
      const handleCancelMock = jest.fn();
      render(<EditHikeForm handleCancel={handleCancelMock} />);
      const button = screen.getByRole("button", { name: /cancel hike/i });
      await userEvent.click(button);
      expect(handleCancelMock).toHaveBeenCalledTimes(1);
    });

    it("resets form fields to their initial values when reset button is clicked", async () => {
      const MOCK_HIKE = {
        title: "Sunset Hike",
        date: "2024-12-01",
        time: "18:00",
        location: "Blue Ridge Parkway",
        comments: "Bring water and snacks.",
      };
      render(<EditHikeForm hikeInfo={MOCK_HIKE} />);
      const titleField = screen.getByLabelText(/title/i);
      await userEvent.clear(titleField);
      await userEvent.type(titleField, "Changed Title");
      const button = screen.getByRole("button", { name: /discard changes/i });
      await userEvent.click(button);
      expect(titleField).toHaveValue(MOCK_HIKE.title);
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
