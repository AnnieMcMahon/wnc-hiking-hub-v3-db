import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react"; 
import { Participants } from "@/app/ui/components/Participants";

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogTitle: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogTrigger: ({ asChild, children, ...props }) => 
    asChild ? children : <div {...props}>{children}</div>,
}));

jest.mock("@/app/ui/components/Participant", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-participant">Mock Participant</div>,
}));

const mockParticipants = [
  {
    id: 1,
    hike_id: 4,
    user_id: 2,
  },
  {
    id: 2,
    hike_id: 4,
    user_id: 3,
  },
]

describe("Participants", () => {

  describe("rendering", () => {
    it("renders a Participants component", () => {
      render(<Participants participants={mockParticipants}/>);
      expect(screen.getByText(/2 participants/i)).toBeInTheDocument();
    });

    it("renders Participant components", () => {
      render(<Participants participants={mockParticipants} />);
      expect(screen.getAllByTestId("mock-participant")).toHaveLength(2);
    });
  });

  describe("functional", () => {
    it("renders '1 participant' correctly when there is a single participant", () => {
      render(<Participants participants={[mockParticipants[0]]} />);
      expect(screen.getByText(/1 participant$/i)).toBeInTheDocument();
    });

    it("renders '0 Participants' correctly when there are no Participants", () => {
      render(<Participants participants={[]} />);
      expect(screen.getByText(/0 participants/i)).toBeInTheDocument();
    });
  });
});
