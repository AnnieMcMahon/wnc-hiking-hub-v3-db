import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react"; 
import Participant from "@/app/ui/components/Participant";
import { fetchUserById } from "@/app/api/data/data";
import { MOCK_USER } from "@/app/lib/constants";

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, ...props }) => <div {...props}>{children}</div>,
  AvatarFallback: ({ children, ...props }) => <div {...props}>{children}</div>,
  AvatarImage: ({ src, ...props }) => <img src={src} {...props} alt="User Avatar" />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }) => (
    <a {...props} data-testid="mock-next-link">
      {children}
    </a>
  ),
}));

jest.mock("@/app/api/data/data", () => ({
  fetchUserById: jest.fn(),
}));

const mockParticipant = {
  user_id: 2,
  hike_id: 3,
  id: 4,
};

describe("Participant", () => {
  beforeEach(() => {
    fetchUserById.mockResolvedValue([MOCK_USER]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a Participant component with the correct text", async () => {
      render(<Participant participant={mockParticipant} />);
      await waitFor(() => {
      expect(screen.getByText(/test user/i)).toBeInTheDocument();
      });
    });

    it("fetches user data and updates state", async () => {
      render(<Participant participant={mockParticipant} />);
      await waitFor(() => {
        expect(fetchUserById).toHaveBeenCalledWith(mockParticipant.user_id);
      });
      expect(screen.getByText(/test user/i)).toBeInTheDocument();
    });

    it("displays the correct avatar", async () => {
      render(<Participant participant={mockParticipant} />);
      const avatarImage = await screen.findByAltText("User Avatar");
      expect(avatarImage).toHaveAttribute("src", "/newUser.png");
    });

    it("displays fallback avatar when no image is provided", async () => {
      fetchUserById.mockResolvedValue([{ user_name: "John Doe", avatar: "" }])
      render(<Participant participant={mockParticipant} />);
      await waitFor(() => {
        expect(screen.getByText("Avatar")).toBeInTheDocument();
      });
    });
  });
});
