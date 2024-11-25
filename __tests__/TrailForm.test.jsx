import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrailForm from "@/app/ui/TrailForm";
import { useModal } from "@/app/context/ModalContext";

jest.mock("@/app/context/ModalContext", () => ({
  useModal: jest.fn(),
}));

let showModalMock;

  beforeEach(() => {
    showModalMock = jest.fn();
    useModal.mockReturnValue({ showModal: showModalMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

describe("TrailForm", () => {
  describe("rendering", () => {
    it("renders a TrailForm component", () => {
      render(<TrailForm />);
      expect(screen.getByText(/trail name/i)).toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("does not throw when onClick is not provided", async () => {
      render(<TrailForm />);
      const button = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(button);
    });

    it("does not throw when onSubmit is not provided", async () => {
      render(<TrailForm />);
      const button = screen.getByRole("button", { name: /submit form/i });
      await userEvent.click(button);
    });

    it("does not call onSubmit if required fields are empty", async () => {
      const mockOnSubmit = jest.fn();
      render(<TrailForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button", { name: /submit form/i });
      await userEvent.click(button);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit when button is clicked and data is present", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<TrailForm onSubmit={mockOnSubmit} />);
      const button = screen.getByRole("button", { name: /submit form/i });
      const trailNameField = screen.getByLabelText(/Trail Name/i);
      const areaField = screen.getByLabelText(/Area Name/i);
      const lengthField = screen.getByLabelText(/Length/i);
      const elevationField = screen.getByLabelText(/Elevation Gain/i);
      const trailLinkField = screen.getByLabelText(/AllTrails Link/i);
      await user.type(trailNameField, "abc");
      await user.type(areaField, "xxx");
      await user.type(lengthField, "3");
      await user.type(elevationField, "100");
      await user.type(trailLinkField, "www.abc.com");
      await user.click(button);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it("uses the default onSubmit function when none is provided", async () => {
      render(<TrailForm />);
      const button = screen.getByRole("button", { name: /submit form/i });
      await userEvent.click(button);
    });

    it("uses the default onClick function when none is provided", async () => {
      render(<TrailForm />);
      const button = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(button);
    });
  });
});
