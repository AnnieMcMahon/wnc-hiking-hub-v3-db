import { render, screen, fireEvent } from "@testing-library/react";
import { useModal } from "@/app/context/ModalContext";
import Modal from "@/app/Modal";
import { MOCK_NAMES_AVATARS } from "@/app/lib/constants";

jest.mock("@/app/context/ModalContext");

describe("Modal component", () => {
  let closeModalMock;
  
  beforeEach(() => {
    closeModalMock = jest.fn();
    useModal.mockReturnValue({
      modal: { isOpen: false, title: "", message: "", onConfirm: null },
      closeModal: closeModalMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when modal is not open", () => {
    render(<Modal />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders modal content when modal is open", () => {
    useModal.mockReturnValue({
      modal: {
        isOpen: true,
        title: "Test Title",
        message: "Test Message",
        onConfirm: null,
      },
      closeModal: closeModalMock,
    });
    render(<Modal />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("renders modal rich content when modal is open and object is passed" +
      "instead of a string", () => {
    useModal.mockReturnValue({
      modal: {
        isOpen: true,
        title: "Test Title",
        message: MOCK_NAMES_AVATARS,
        onConfirm: null,
      },
      closeModal: closeModalMock,
    });
    render(<Modal />);
    const names = MOCK_NAMES_AVATARS.names;
    const paths = MOCK_NAMES_AVATARS.paths;
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    names.map(uname => expect(screen.getByText(uname)).toBeInTheDocument());
    paths.map((path, index) => {
      const avatar = screen.getByRole('img', { name: names[index] });
      expect(avatar).toHaveAttribute('src', path);
    });
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("calls closeModal when Close button is clicked", () => {
    useModal.mockReturnValue({
      modal: {
        isOpen: true,
        title: "Test Title",
        message: "Test Message",
        onConfirm: null,
      },
      closeModal: closeModalMock,
    });
    render(<Modal />);
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });

  it("renders Confirm button and calls onConfirm when clicked", () => {
    const onConfirmMock = jest.fn();
    useModal.mockReturnValue({
      modal: {
        isOpen: true,
        title: "Test Title",
        message: "Test Message",
        onConfirm: onConfirmMock,
      },
      closeModal: closeModalMock,
    });
    render(<Modal />);
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
