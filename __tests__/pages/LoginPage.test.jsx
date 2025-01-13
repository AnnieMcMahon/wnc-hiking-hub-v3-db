import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Login from "@/app/(dashboard)/Login/page";
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
  const userInfo = { email: "user@abc.com", password: "ValidPassword1!" };

  beforeEach(() => {
    const mockSetCurrentUser = jest.fn();

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a Login component", () => {
      render(<Login />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(/log in/i);
    });
  });

  describe("functional", () => {
    it("handles successful login", async () => {
      fetchUserByEmail.mockResolvedValue([userInfo]);
      login.mockResolvedValue();
      render(<Login />);
      await waitFor(() => {
        const loginButton = screen.getByTestId("login-button");
        fireEvent.click(loginButton);
        expect(fetchUserByEmail).toHaveBeenCalledWith("user@abc.com");
        expect(login).toHaveBeenCalledWith({
          email: "user@abc.com",
          password: "ValidPassword1!",
        });
        expect(useGlobal().setCurrentUser).toHaveBeenCalledWith(userInfo);
        expect(mockRouterPush).toHaveBeenCalledWith("/bio");
      });
    });
    it("shows error modal for invalid login password", async () => {
      fetchUserByEmail.mockResolvedValue([userInfo]);
      login.mockRejectedValue(new Error("Invalid password"));
      render(<Login />);
      const loginButton = screen.getByTestId("login-button");
      fireEvent.click(loginButton);
      await waitFor(() => {
        expect(showModalMock).toHaveBeenCalledWith(
          "Error",
          "Invalid password. Please try again."
        );
      });
    });

    it("shows signup modal for non-existent user", async () => {
      fetchUserByEmail.mockResolvedValue([]);
      render(<Login />);
      await waitFor(() => {
        const loginButton = screen.getByTestId("login-button");
        fireEvent.click(loginButton);
        expect(showModalMock).toHaveBeenCalledWith(
          "Create Account",
          "No account found. Would you like to create one?",
          expect.any(Function)
        );
      });
    });

    it("handles password reset for valid email", async () => {
      fetchUserByEmail.mockResolvedValue([{ email: "user@abc.com" }]);
      resetPassword.mockResolvedValue();
      render(<Login />);
      const resetLink = screen.getByTestId("reset-pw-link");
      await waitFor(() => {
        fireEvent.click(resetLink);
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

    it("shows error modal for password reset with invalid email", async () => {
      fetchUserByEmail.mockRejectedValue(new Error("Invalid email"));
      render(<Login />);
      const resetLink = screen.getByTestId("reset-pw-link");
      await waitFor(() => {
        fireEvent.click(resetLink);
        expect(showModalMock).toHaveBeenCalledWith(
          "Error",
          "Please enter a valid e-mail address."
        );
      });
    });

    it("handles successful signup after account creation prompt", async () => {
      const newUser = { id: 3, email: "user@abc.com" };
      fetchUserByEmail.mockResolvedValue([]);
      signup.mockResolvedValue();
      addUser.mockResolvedValue([newUser]);
      render(<Login />);

      await waitFor(() => {
        const loginButton = screen.getByTestId("login-button");
        fireEvent.click(loginButton);
        expect(showModalMock).toHaveBeenCalledWith(
          "Create Account",
          "No account found. Would you like to create one?",
          expect.any(Function)
        );

        const signupCallback = showModalMock.mock.calls[0][2];
        signupCallback();
        expect(
          screen.getByText(
            /By submitting this waiver and release of liability/i
          )
        ).toBeInTheDocument();
        const agreeButton = screen.getByRole("button", { name: /I agree/i });
        fireEvent.click(agreeButton);
        expect(signup).toHaveBeenCalledWith(userInfo);
        expect(addUser).toHaveBeenCalledWith(userInfo.email);
        expect(useGlobal().setCurrentUser).toHaveBeenCalledWith(newUser);
        expect(closeModalMock).toHaveBeenCalled();
        expect(mockRouterPush).toHaveBeenCalledWith("/edit-bio");
      });
    });

    it("shows error modal if signup fails", async () => {
      fetchUserByEmail.mockResolvedValue([]);
      signup.mockRejectedValue(new Error("Signup failed"));
      render(<Login />);
      await waitFor(() => {
        const loginButton = screen.getByTestId("login-button");
        fireEvent.click(loginButton);
        const loginButton = screen.getByTestId("login-button");
        fireEvent.click(loginButton);
        expect(showModalMock).toHaveBeenCalledWith(
          "Create Account",
          "No account found. Would you like to create one?",
          expect.any(Function)
        );
        const signupCallback = showModalMock.mock.calls[0][2];
        signupCallback();
        const agreeButton = screen.getByRole("button", { name: /I agree/i });
        fireEvent.click(agreeButton);
        expect(signup).toHaveBeenCalled();
        expect(showModalMock).toHaveBeenCalledWith(
          "Error",
          "An error has occurred. Please try again."
        );
      });
    });
    */
  });
});
