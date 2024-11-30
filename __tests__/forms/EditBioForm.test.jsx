import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MOCK_BIO_INFO } from "@/app/lib/constants";
import EditBioForm from "@/app/ui/forms/EditBioForm";

describe("EditBioForm", () => {
  describe("rendering", () => {
    it("renders form fields with initial MOCK_BIO_INFO values", () => {
      render(<EditBioForm bioInfo={MOCK_BIO_INFO} />);
      expect(screen.getByLabelText(/name/i)).toHaveValue(MOCK_BIO_INFO.user_name);
      expect(screen.getByLabelText(/bio/i)).toHaveValue(MOCK_BIO_INFO.bio);
    });

    it("handles empty MOCK_BIO_INFO gracefully", () => {
      render(<EditBioForm bioInfo={{}} />);
      expect(screen.getByLabelText(/name/i)).toHaveValue("");
      expect(screen.getByLabelText(/bio/i)).toHaveValue("");
    });
  });

  describe("functional", () => {
    it("does not throw when onSubmit is not provided", async () => {
      render(<EditBioForm />);
      const button = screen.getByRole("button", { name: /save/i });
      await userEvent.click(button);
    });

    it("does not throw when onClick is not provided", async () => {
      render(<EditBioForm />);
      const button = screen.getByRole("button", { name: /discard/i });
      await userEvent.click(button);
    });

    it("handles file input without crashing when handleAvatarChange is not provided", async () => {
      render(<EditBioForm />);
      const fileInput = screen.getByLabelText(/avatar/i);
      const file = new File(["dummy content"], "avatar.png", { type: "image/png" });
      await userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).toBe(file);
      expect(fileInput.files).toHaveLength(1);
    });

    it("calls onChange when the name field is updated", async () => {
      const onChangeMock = jest.fn();
      render(<EditBioForm bioInfo={MOCK_BIO_INFO} onChange={onChangeMock} />);
      const nameField = screen.getByLabelText(/name/i);
      await userEvent.clear(nameField);
      await userEvent.type(nameField, "New Hiker");
      expect(onChangeMock).toHaveBeenCalledTimes("New Hiker".length + 1);
    });

    it("calls onChange when the bio field is updated", async () => {
      const onChangeMock = jest.fn();
      render(<EditBioForm bioInfo={MOCK_BIO_INFO} onChange={onChangeMock} />);
      const bioField = screen.getByLabelText(/bio/i);
      await userEvent.clear(bioField);
      await userEvent.type(bioField, "I love hiking.");
      expect(onChangeMock).toHaveBeenCalledTimes("I love hiking.".length + 1);
    });

    it("calls onSubmit when the form is submitted", async () => {
      const onSubmitMock = jest.fn();
      render(<EditBioForm onSubmit={onSubmitMock} MOCK_BIO_INFO={MOCK_BIO_INFO} />);
      const button = screen.getByRole("button", { name: /save/i });
      await userEvent.click(button);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    it("calls onClick when the discard button is clicked", async () => {
      const onClickMock = jest.fn();
      render(<EditBioForm onClick={onClickMock} />);
      const button = screen.getByRole("button", { name: /discard/i });
      await userEvent.click(button);
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it("calls handleAvatarChange when form fields are updated", async () => {
      const handleAvatarChangeMock = jest.fn();
      render(<EditBioForm handleAvatarChange={handleAvatarChangeMock} />);
      const fileInput = screen.getByLabelText(/avatar/i);
      const file = new File(["dummy content"], "avatar.png", { type: "image/png" });
      await userEvent.upload(fileInput, file);
      expect(handleAvatarChangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
