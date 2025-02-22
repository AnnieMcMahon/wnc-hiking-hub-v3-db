import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react"; 
import Comment from "@/app/ui/components/Comment";
import { convertDate } from "@/app/lib/utils";
import { fetchUserById } from "@/app/api/data/data";
import { MOCK_USER } from "@/app/lib/constants";

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, ...props }) => <div {...props}>{children}</div>,
  AvatarFallback: ({ children, ...props }) => <div {...props}>{children}</div>,
  AvatarImage: ({ src, ...props }) => <img src={src} {...props} alt="User Avatar" />,
}));

jest.mock("@/app/lib/utils", () => ({
  convertDate: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  fetchUserById: jest.fn(),
}));

const mockComment = {
  hike_id: 4,
  user_id: 2,
  created_at: "Friday, 12/01/2024",
  comment_text: "Looking forward to it!",
};

describe("Comment", () => {
  beforeEach(() => {
    convertDate.mockReturnValue("12/01/2024");
    fetchUserById.mockResolvedValue([MOCK_USER]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a Comment component with the correct text", async () => {
      render(<Comment comment={mockComment} />);
      await waitFor(() => {
      expect(screen.getByText(/looking forward to it/i)).toBeInTheDocument();
      });
    });

    it("fetches user data and updates state", async () => {
      render(<Comment comment={mockComment} />);
      await waitFor(() => {
        expect(fetchUserById).toHaveBeenCalledWith(mockComment.user_id);
      });
      expect(screen.getByText(/test user/i)).toBeInTheDocument();
      expect(screen.getByText("12/01/2024")).toBeInTheDocument();
    });

    it("displays the correct avatar", async () => {
      render(<Comment comment={mockComment} />);
      const avatarImage = await screen.findByAltText("User Avatar");
      expect(avatarImage).toHaveAttribute("src", "/newUser.png");
    });

    it("displays fallback avatar when no image is provided", async () => {
      fetchUserById.mockResolvedValue([{ user_name: "John Doe", avatar: "" }])
      render(<Comment comment={mockComment} />);
      await waitFor(() => {
        expect(screen.getByText("Avatar")).toBeInTheDocument();
      });
    });
  });
});
