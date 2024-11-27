import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrailForm from "@/app/ui/forms/TrailForm";
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
    it("does not throw when functions are not provided", async () => {
      render(<TrailForm />);
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancelButton);
      const submitButton = screen.getByRole("button", { name: /submit form/i });
      await userEvent.click(submitButton);
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
      const areaField = screen.getByRole("combobox", { name: /area name/i });
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

    it("renders dropdowns with default values", () => {
      render(<TrailForm />);
      const areaDropdown = screen.getByRole("combobox", { name: /area name/i });
      const difficultyDropdown = screen.getByRole("combobox", {
        name: /difficulty rating/i,
      });
      const lengthDropdown = screen.getByRole("combobox", { name: /route type/i });
      expect(areaDropdown).toHaveValue("");
      expect(difficultyDropdown).toHaveValue("easy");
      expect(lengthDropdown).toHaveValue("loop");
    });
  });
});
