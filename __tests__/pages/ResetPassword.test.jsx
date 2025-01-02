import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";
import { updatePassword } from "@/app/api/authentication/auth";
import { validatePassword } from "@/app/lib/utils";
import ResetPassword from "@/app/(dashboard)/reset-password/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

jest.mock("@/app/lib/utils", () => ({
  validatePassword: jest.fn(),
}));

jest.mock("@/app/api/authentication/auth", () => ({
  updatePassword: jest.fn(),
}));

describe("ResetPassword", () => {
  let mockRouterPush;
  let showModalMock;
  let closeModalMock;

  beforeEach(() => {
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
    it("renders a ResetPassword component", () => {
      render(<ResetPassword />);
      expect(screen.getByText(/new password:/i)).toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("displays an error modal if the password is invalid", async () => {
      const errorMessage = "Password must be at least 6 characters.";
      validatePassword.mockReturnValue(errorMessage);
      render(<ResetPassword />);
      const form = screen.getByRole("form");
      const passwordInput = screen.getByLabelText(/new password:/i);
      fireEvent.change(passwordInput, { target: { value: "short" } });
      console.log(passwordInput.value);
      fireEvent.submit(form);
      expect(validatePassword).toHaveBeenCalledWith("short");
      expect(showModalMock).toHaveBeenCalledWith("Error", errorMessage);
    });

    it("calls updatePassword and shows success modal on valid password", async () => {
      validatePassword.mockReturnValue(null);
      updatePassword.mockResolvedValue();
      render(<ResetPassword />);
      const passwordInput = screen.getByLabelText(/new password:/i);
      const form = screen.getByRole("form");
      fireEvent.change(passwordInput, { target: { value: "ValidPassword1!" } });
      fireEvent.submit(form);
  
      await waitFor(() => {
        expect(validatePassword).toHaveBeenCalledWith("ValidPassword1!");
        expect(updatePassword).toHaveBeenCalledWith("ValidPassword1!");
        expect(showModalMock).toHaveBeenCalledWith(
          "Success",
          "Your password has been updated.",
          null,
          expect.any(Function)
        );
        expect(mockRouterPush).toHaveBeenCalledWith("/login");
      });
    });

    it("displays an error modal if updatePassword fails", async () => {
      const apiErrorMessage = "Failed to update password.";
      validatePassword.mockReturnValue(null);
      updatePassword.mockRejectedValue(new Error(apiErrorMessage)); 
      render(<ResetPassword />);
      const passwordInput = screen.getByLabelText(/new password:/i);
      const form = screen.getByRole("form");
      fireEvent.change(passwordInput, { target: { value: "ValidPassword1!" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(updatePassword).toHaveBeenCalledWith("ValidPassword1!");
        expect(showModalMock).toHaveBeenCalledWith("Error", apiErrorMessage);
      });
    });
  });
});
