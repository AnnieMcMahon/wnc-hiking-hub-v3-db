import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react"; 
import { Comments } from "@/app/ui/components/Comments";

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogTitle: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogTrigger: ({ asChild, children, ...props }) => 
    asChild ? children : <div {...props}>{children}</div>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock("@/app/ui/components/Comment", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-comment">Mock Comment</div>,
}));

const mockComments = [
  {
    id: 1,
    hike_id: 4,
    user_id: 2,
    created_at: "Friday, 12/01/2024",
    comment_text: "Looking forward to it!",
  },
  {
    id: 2,
    hike_id: 4,
    user_id: 3,
    created_at: "Saturday, 12/02/2024",
    comment_text: "Me too!",
  },
]

describe("Comments", () => {

  describe("rendering", () => {
    it("renders a Comments component", () => {
      render(<Comments comments={mockComments}/>);
      expect(screen.getByText(/2 comments/i)).toBeInTheDocument();
    });

    it("renders comment components", () => {
      render(<Comments comments={mockComments} />);
      expect(screen.getAllByTestId("mock-comment")).toHaveLength(2);
    });
  });

  describe("functional", () => {
    it("renders '1 comment' correctly when there is a single comment", () => {
      render(<Comments comments={[mockComments[0]]} />);
      expect(screen.getByText(/1 comment$/i)).toBeInTheDocument();
    });

    it("renders '0 comments' correctly when there are no comments", () => {
      render(<Comments comments={[]} />);
      expect(screen.getByText(/0 comments/i)).toBeInTheDocument();
    });
  });
});
