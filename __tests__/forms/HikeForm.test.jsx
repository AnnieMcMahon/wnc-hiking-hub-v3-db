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

    it("uses the default onSubmit function when none is provided", async () => {
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

    it("calls onSubmit when button is clicked and data is present", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<HikeForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button", { name: /submit form/i });
      const titleField = screen.getByLabelText(/title/i);
      const dateField = screen.getByLabelText(/date/i);
      const timeField = screen.getByLabelText(/time/i);
      const locationField = screen.getByLabelText(/location/i);
      const commentsField = screen.getByLabelText(/comments/i);
      await user.type(titleField, "abc");
      await user.type(dateField, "2020-01-01");
      await user.type(timeField, "10:30");
      await user.type(locationField, "here");
      await user.type(commentsField, "hello");
      await user.click(button);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        hikeTitle: "abc",
        date: "2020-01-01",
        time: "10:30",
        location: "here",
        comments: "hello",
      });
    });
  });
});