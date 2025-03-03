import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Login from "@/app/(dashboard)/login/page";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";
import { login, signup, resetPassword } from "@/app/api/authentication/auth";
import { fetchUserByEmail, addUser } from "@/app/api/data/data";

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

jest.mock("@/app/api/authentication/auth", () => ({
  login: jest.fn(),
  signup: jest.fn(),
  resetPassword: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  fetchUserByEmail: jest.fn(),
  addUser: jest.fn(),
}));

jest.mock("@/app/ui/forms/LoginForm", () => {
  return ({ onSubmit, onClick }) => {
    const handleSubmit = () => {
      const userInfo = {
        email: "user@abc.com",
        password: "ValidPassword1!",
      };
      onSubmit(userInfo);
    };

    const handleClick = () => {
      onClick("user@abc.com");
    };

    return (
      <div data-testid="login-form">
        <a href="#" data-testid="reset-pw-link" onClick={handleClick}>
          Forgot password?
        </a>
        <button data-testid="login-button" onClick={handleSubmit}>
          Log In
        </button>
      </div>
    );
  };
});

describe("Login", () => {
  let mockRouterPush;
  let showModalMock;
  let closeModalMock;
  const mockSetCurrentUser = jest.fn();
  const userInfo = { email: "user@abc.com", password: "ValidPassword1!" };

  beforeEach(() => {
    jest.clearAllMocks();
    useGlobal.mockReturnValue({
      setCurrentUser: mockSetCurrentUser,
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

  describe("rendering", () => {
    it("renders a Login component", () => {
      render(<Login />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Log In/i);
    });
  });

  describe("functional", () => {
    it("handles successful login", async () => {
      fetchUserByEmail.mockResolvedValue([userInfo]);
      login.mockResolvedValue();
      render(<Login />);
      const loginButton = screen.getByTestId("login-button");
      fireEvent.click(loginButton);
      await waitFor(() => {
        expect(fetchUserByEmail).toHaveBeenCalledWith("user@abc.com");
        expect(login).toHaveBeenCalledWith(userInfo);
        expect(mockSetCurrentUser).toHaveBeenCalledWith(userInfo);
        expect(mockRouterPush).toHaveBeenCalledWith(`/bio/${userInfo.id}`);
      });
    });

    it("shows error modal for invalid password", async () => {
      fetchUserByEmail.mockResolvedValue([userInfo]);
      login.mockRejectedValue(new Error("Invalid password"));
      render(<Login />);
      fireEvent.click(screen.getByTestId("login-button"));
      await waitFor(() => {
        expect(showModalMock).toHaveBeenCalledWith(
          "Error",
          "Invalid password. Please try again."
        );
      });
    });

    it("shows signup modal when no account is found", async () => {
      fetchUserByEmail.mockResolvedValue([]);
      render(<Login />);
      fireEvent.click(screen.getByTestId("login-button"));
      await waitFor(() => {
        expect(showModalMock).toHaveBeenCalledWith(
          "Create Account",
          "No account found. Would you like to create one?",
          expect.any(Function)
        );
      });
    });

    it("handles password reset for valid email", async () => {
      fetchUserByEmail.mockResolvedValue([userInfo]);
      resetPassword.mockResolvedValue();
      render(<Login />);
      fireEvent.click(screen.getByTestId("reset-pw-link"));
      await waitFor(() => {
        expect(fetchUserByEmail).toHaveBeenCalledWith("user@abc.com");
        expect(resetPassword).toHaveBeenCalledWith(
          "user@abc.com",
          `${window.location.origin}/reset-password`
        );
        expect(showModalMock).toHaveBeenCalledWith(
          "Success",
          "Please follow the link in your e-mail to reset your password."
        );
      });
    });

    it("shows error modal when email for password reset is invalid", async () => {
      fetchUserByEmail.mockRejectedValue(new Error("Invalid email"));
      render(<Login />);
      fireEvent.click(screen.getByTestId("reset-pw-link"));
      await waitFor(() => {
        expect(showModalMock).toHaveBeenCalledWith(
          "Error",
          "Please enter a valid e-mail address."
        );
      });
    });

    it("handles successful signup after user agrees to create an account", async () => {
      fetchUserByEmail.mockResolvedValue([]);
      signup.mockResolvedValue();
      addUser.mockResolvedValue([userInfo]);
      render(<Login />);
      fireEvent.click(screen.getByTestId("login-button"));
      await waitFor(() => {
        expect(showModalMock).toHaveBeenCalledWith(
          "Create Account",
          "No account found. Would you like to create one?",
          expect.any(Function)
        );
        const signupCallback = showModalMock.mock.calls[0][2];
        signupCallback();
        expect(screen.getByText(/By submitting this waiver/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: /I agree/i }));
        expect(signup).toHaveBeenCalledWith(userInfo);
        expect(addUser).toHaveBeenCalledWith(userInfo.email);
        expect(mockSetCurrentUser).toHaveBeenCalledWith(userInfo);
        expect(closeModalMock).toHaveBeenCalled();
        expect(mockRouterPush).toHaveBeenCalledWith("/edit-bio");
      });
    });

    it("shows error modal when signup fails", async () => {
      fetchUserByEmail.mockResolvedValue([]);
      signup.mockRejectedValue(new Error("Signup failed"));
      render(<Login />);
      fireEvent.click(screen.getByTestId("login-button"));
      await waitFor(() => {
        expect(showModalMock).toHaveBeenCalledWith(
          "Create Account",
          "No account found. Would you like to create one?",
          expect.any(Function)
        );
        const signupCallback = showModalMock.mock.calls[0][2];
        signupCallback();
        fireEvent.click(screen.getByRole("button", { name: /I agree/i }));
        expect(signup).toHaveBeenCalled();
        expect(showModalMock).toHaveBeenCalledWith(
          "Error",
          "An error has occurred. Please try again."
        );
      });
    });
  });
});
