import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HikeForm from "@/app/ui/forms/HikeForm";
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

describe("HikeForm", () => {
  describe("rendering", () => {
    it("renders a HikeForm component", () => {
      render(<HikeForm />);
      expect(screen.getByText(/title/i)).toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("does not throw when onSubmit is not provided", async () => {
      render(<HikeForm />);
      const button = screen.getByRole("button", { name: /submit form/i });
      await userEvent.click(button);
    });

    it("does not call onSubmit if required fields are empty", async () => {
      const mockOnSubmit = jest.fn();
      render(<HikeForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button", { name: /submit form/i });
      await userEvent.click(button);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("does not call onSubmit if date is earlier than today", async () => {
      const mockOnSubmit = jest.fn();
      render(<HikeForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button", { name: /submit form/i });
      const titleField = screen.getByLabelText(/title/i);
      const dateField = screen.getByLabelText(/date/i);
      const timeField = screen.getByLabelText(/time/i);
      const locationField = screen.getByLabelText(/location/i);
      const commentsField = screen.getByLabelText(/comments/i);
      await userEvent.type(titleField, "abc");
      await userEvent.type(dateField, "2020-01-01");
      await userEvent.type(timeField, "10:30");
      await userEvent.type(locationField, "here");
      await userEvent.type(commentsField, "hello");
      await userEvent.click(button);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit when button is clicked and data is present", async () => {
      const mockOnSubmit = jest.fn();
      render(<HikeForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button", { name: /submit form/i });
      const titleField = screen.getByLabelText(/title/i);
      const dateField = screen.getByLabelText(/date/i);
      const timeField = screen.getByLabelText(/time/i);
      const locationField = screen.getByLabelText(/location/i);
      const commentsField = screen.getByLabelText(/comments/i);
      await userEvent.type(titleField, "abc");
      await userEvent.type(dateField, "2026-01-01");
      await userEvent.type(timeField, "10:30");
      await userEvent.type(locationField, "here");
      await userEvent.type(commentsField, "hello");
      await userEvent.click(button);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        hikeTitle: "abc",
        date: "2026-01-01",
        time: "10:30",
        location: "here",
        comments: "hello",
      });
    });
  });
});
