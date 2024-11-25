import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/ui/LoginForm";
import { useModal } from "@/app/context/ModalContext";

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

describe("LoginForm", () => {
  let showModalMock;

  beforeEach(() => {
    showModalMock = jest.fn();
    useModal.mockReturnValue({ showModal: showModalMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a LoginForm component", () => {
      render(<LoginForm />);
      expect(screen.getByText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByText(/password/i)).toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("does not throw when onSubmit is not provided", async () => {
      render(<LoginForm />);
      const button = screen.getByRole("button", { name: /log in/i });
      await userEvent.click(button);
    });

    it("calls onSubmit when button is clicked and data is present", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button");
      const emailField = screen.getByLabelText(/e-mail/i);
      const passwordField = screen.getByLabelText(/password/i);
      await user.type(emailField, "user@gmail.com");
      await user.type(passwordField, "password123");
      await user.click(button);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it("calls showModal with the correct error message when the password is too short", async () => {
      const mockOnSubmit = jest.fn();
      render(<LoginForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button");
      const emailField = screen.getByLabelText(/e-mail/i);
      const passwordField = screen.getByLabelText(/password/i);
      await userEvent.type(emailField, "user@gmail.com");
      await userEvent.type(passwordField, "pass");
      await userEvent.click(button);
      expect(showModalMock).toHaveBeenCalledWith(
        "Error",
        "Password must be at least 6 characters."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("does not call onSubmit if required fields are empty", async () => {
      const mockOnSubmit = jest.fn();
      render(<LoginForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button");
      await userEvent.click(button);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("prevents submission if email format is invalid", async () => {
      const mockOnSubmit = jest.fn();
      render(<LoginForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button");
      const emailField = screen.getByLabelText(/e-mail/i);
      const passwordField = screen.getByLabelText(/password/i);
      await userEvent.type(emailField, "invalid-email");
      await userEvent.type(passwordField, "password123");
      await userEvent.click(button);
      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(showModalMock).not.toHaveBeenCalled();
    });

    it("does not call showModal if password length is sufficient", async () => {
      const mockOnSubmit = jest.fn();
      render(<LoginForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button");
      const emailField = screen.getByLabelText(/e-mail/i);
      const passwordField = screen.getByLabelText(/password/i);
      await userEvent.type(emailField, "user@gmail.com");
      await userEvent.type(passwordField, "password123");
      await userEvent.click(button);
      expect(showModalMock).not.toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it("uses the default onSubmit function when none is provided", async () => {
      render(<LoginForm />);
      const button = screen.getByRole("button", { name: /log in/i });
      await userEvent.click(button);
    });

    it("allows submission when password length is exactly 6 characters", async () => {
      const mockOnSubmit = jest.fn();
      render(<LoginForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button");
      const emailField = screen.getByLabelText(/e-mail/i);
      const passwordField = screen.getByLabelText(/password/i);
      await userEvent.type(emailField, "user@gmail.com");
      await userEvent.type(passwordField, "123456");
      await userEvent.click(button);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(showModalMock).not.toHaveBeenCalled();
    });
  });
});
