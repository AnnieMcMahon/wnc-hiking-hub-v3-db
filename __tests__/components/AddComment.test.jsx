import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react"; 
import userEvent from "@testing-library/user-event";
import { AddComment } from "@/app/ui/components/AddComment";
import { useGlobal } from "@/app/context/GlobalContext";
import { addComment } from "@/app/api/data/data";
import { MOCK_USER } from "@/app/lib/constants";

jest.mock("@/app/context/GlobalContext", () => ({
  useGlobal: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  addComment: jest.fn(),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogTitle: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogTrigger: ({ asChild, children, ...props }) => 
    asChild ? children : <div {...props}>{children}</div>,
  DialogFooter: ({ children, ...props }) => <div {...props}>{children}</div>, 
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: ({ ...props }) => <textarea {...props} />,
}));

describe("AddComment", () => {
  beforeEach(() => {
    mockSetTriggerRefresh = jest.fn();
    useGlobal.mockReturnValue({
      currentUser: MOCK_USER,
      setTriggerRefresh: mockSetTriggerRefresh,
    });

    addComment.mockResolvedValue([{
      id: 1,
      user_id: 2,
      hike_id: 3,
      comment_text: "See you there!"
    }]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a AddComment component", () => {
      render(<AddComment hikeId={3}/>);
      expect(screen.getByText(/submit comment/i)).toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("opens the comment dialog when 'Add Comment' button is clicked", async () => {
      render(<AddComment hikeId={3} />);
      const addCommentButton = screen.getByRole("button", { name: /add comment/i });
      await userEvent.click(addCommentButton);
        expect(screen.getByRole("button", { name: /submit comment/i })).toBeInTheDocument();
    });
    
    it("displays an error if the comment is too short", async () => {
      render(<AddComment hikeId={3} />);
      const addCommentButton = screen.getByRole("button", { name: /add comment/i });
      await userEvent.click(addCommentButton);
      await waitFor(() => {
        expect(screen.getByText(/submit comment/i)).toBeInTheDocument;
      }); 
      const submitButton = screen.getByText(/submit comment/i);
      await userEvent.click(submitButton);
      expect(screen.getByText(/your comment must be longer than two characters/i)).toBeInTheDocument();
    });
    
    it("prevents submission in demo mode", async () => {
      useGlobal.mockReturnValue({
        currentUser: { id: 1 },
        setTriggerRefresh: jest.fn(),
      });
      render(<AddComment hikeId={3} />);
      const addCommentButton = screen.getByRole("button", { name: /add comment/i });
      await userEvent.click(addCommentButton);
      await waitFor(() => {
        expect(screen.getByText(/submit comment/i)).toBeInTheDocument;
      }); 
      const textarea = screen.getByPlaceholderText(/type your comment here/i);
      await userEvent.type(textarea, "This is a test comment.");
      const submitButton = screen.getByText(/submit comment/i);
      await userEvent.click(submitButton);
      expect(screen.getByText(/demo mode - comment cannot be saved/i)).toBeInTheDocument();
    });
    
    it("submits a comment successfully", async () => {
      render(<AddComment hikeId={3} />);
      const addCommentButton = screen.getByRole("button", { name: /add comment/i });
      await userEvent.click(addCommentButton);
      await waitFor(() => {
        expect(screen.getByText(/submit comment/i)).toBeInTheDocument;
      }); 
      const textarea = screen.getByPlaceholderText(/type your comment here/i);
      await userEvent.type(textarea, "Great hike!");
    
      const submitButton = screen.getByText(/submit comment/i);
      await userEvent.click(submitButton);
        expect(addComment).toHaveBeenCalledWith({
          user_id: MOCK_USER.id,
          hike_id: 3,
          comment_text: "Great hike!",
        });
        expect(screen.getByText(/comment successfully added/i)).toBeInTheDocument();
    });

    it("shows an error if the API request fails", async () => {
      addComment.mockRejectedValue(new Error("API Error"));
      render(<AddComment hikeId={3} />);
      await waitFor(() => {
        expect(screen.getByText(/submit comment/i)).toBeInTheDocument;
      }); 
      const textarea = screen.getByPlaceholderText(/type your comment here/i);
      await userEvent.type(textarea, "This is a failing comment.");
      const submitButton = screen.getByText(/submit comment/i);
      await userEvent.click(submitButton);
      expect(screen.getByText(/error adding comment/i)).toBeInTheDocument();
    });

    it("triggers a refresh after a successful comment submission", async () => {
      render(<AddComment hikeId={3} />);
      await waitFor(() => {
        expect(screen.getByText(/submit comment/i)).toBeInTheDocument;
      }); 
      const addCommentButton = screen.getByRole("button", { name: /add comment/i });
      await userEvent.click(addCommentButton);
      const textarea = screen.getByPlaceholderText(/type your comment here/i);
      await userEvent.type(textarea, "Refreshing the page!");
      const submitButton = screen.getByText(/submit comment/i);
      await userEvent.click(submitButton);
      expect(mockSetTriggerRefresh).toHaveBeenCalledWith(true);
    });
  });
});
