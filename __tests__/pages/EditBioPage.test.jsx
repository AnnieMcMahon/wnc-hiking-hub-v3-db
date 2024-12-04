import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { updateUser, uploadAvatar } from "@/app/api/data/data";
import EditBio from "@/app/(dashboard)/edit-bio/page";

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  updateUser: jest.fn(),
  uploadAvatar: jest.fn(),
}));

jest.mock("@/app/ui/forms/EditBioForm", () => {
  return (props) => {
    const { bioInfo, onSubmit, onClick, onChange, handleAvatarChange } = props;
    return (
      <div data-testid="edit-bio-form">
        <h1>Edit Bio</h1>
        <div id="form-area">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(bioInfo);
            }}
          >
            <label>Name:</label>
            <input
              type="text"
              name="user_name"
              value={bioInfo.user_name || ""}
              onChange={onChange}
              data-testid="name-input"
            />
            <label>Avatar:</label>
            <input
              type="file"
              name="avatar"
              onChange={handleAvatarChange}
              data-testid="avatar-input"
            />
            <label>Bio:</label>
            <textarea
              name="bio"
              value={bioInfo.bio || ""}
              onChange={onChange}
              data-testid="bio-textarea"
            />
            <button type="submit" data-testid="save-button">
              Save
            </button>
            <button
              type="button"
              onClick={onClick}
              data-testid="discard-button"
            >
              Discard
            </button>
          </form>
        </div>
      </div>
    );
  };
});

describe("EditBio", () => {
  let mockRouterPush, mockCurrentUser, mockSetCurrentUser;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });
    mockCurrentUser = { id: 1, user_name: "Test User", bio: "Test Bio", avatar: "" };
    mockSetCurrentUser = jest.fn();
    useGlobal.mockReturnValue({
      currentUser: mockCurrentUser,
      setCurrentUser: mockSetCurrentUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the EditBio and EditBioForm components", async () => {
      render(<EditBio />);
      await waitFor(() => {
        expect(screen.getByTestId("edit-bio-form")).toBeInTheDocument();
      });
    });
  });

  describe("functional", () => {
    it("navigates to /bio after clicking the Discard button", async () => {
      render(<EditBio />);
      await waitFor(() => {
        const discardButton = screen.getByTestId("discard-button");
        discardButton.click();
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/bio");
    });

    it("submits the form and updates the user info", async () => {
      render(<EditBio />);
      await waitFor(() => {
        const nameInput = screen.getByTestId("name-input");
        const bioTextarea = screen.getByTestId("bio-textarea");
        const saveButton = screen.getByTestId("save-button");
        fireEvent.change(nameInput, { target: { value: "New Name" } });
        fireEvent.change(bioTextarea, { target: { value: "New Bio" } });
        fireEvent.click(saveButton);
      });
      expect(updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          user_name: "New Name",
          bio: "New Bio",
        })
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/bio");
    });

    it("does not update user if no changes are made", async () => {
      render(<EditBio />);
      await waitFor(() => {
        const saveButton = screen.getByTestId("save-button");
        fireEvent.click(saveButton);
      });
      expect(updateUser).not.toHaveBeenCalled();
      expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("handles avatar upload correctly", async () => {
      const file = new File(["avatar"], "avatar.png", { type: "image/png" });
      const mockUploadAvatar = jest.fn().mockResolvedValue("new-avatar-url");
      uploadAvatar.mockImplementation(mockUploadAvatar);
      render(<EditBio />);
      await waitFor(() => {
        const avatarInput = screen.getByTestId("avatar-input");
        const saveButton = screen.getByTestId("save-button");
        fireEvent.change(avatarInput, { target: { files: [file] } });
        saveButton.click();
      });
      expect(mockUploadAvatar).toHaveBeenCalledWith(file, mockCurrentUser.id);
      expect(updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          avatar: "new-avatar-url",
        })
      );
    });
  });
});
