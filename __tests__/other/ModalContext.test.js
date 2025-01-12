import { render, screen } from "@testing-library/react";
import { ModalProvider, useModal } from "@/app/context/ModalContext";
import userEvent from "@testing-library/user-event";

function TestComponent() {
  const { modal, showModal, closeModal } = useModal();
  return (
    <div>
      <p data-testid="modal-state">{JSON.stringify(modal)}</p>
      <button onClick={() => showModal("Test Title", "Test Message")}>Show Modal</button>
      <button onClick={closeModal}>Close Modal</button>
    </div>
  );
}

describe("ModalContext", () => {
  it("provides default modal state correctly", () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );
    const modalState = screen.getByTestId("modal-state").textContent;
    expect(modalState).toBe(
      JSON.stringify({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        onClose: null,
      })
    );
  });

  it("updates modal state when showModal is called", async () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );
    const showModalButton = screen.getByText("Show Modal");
    await userEvent.click(showModalButton);
    const modalState = screen.getByTestId("modal-state").textContent;
    expect(modalState).toBe(
      JSON.stringify({
        isOpen: true,
        title: "Test Title",
        message: "Test Message",
        onConfirm: null,
      })
    );
  });

  it("closes the modal when closeModal is called", async () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );
    const showModalButton = screen.getByText("Show Modal");
    await userEvent.click(showModalButton);
    const closeModalButton = screen.getByText("Close Modal");
    await userEvent.click(closeModalButton);
    const modalState = screen.getByTestId("modal-state").textContent;
    expect(modalState).toBe(
      JSON.stringify({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        onClose: null,
      })
    );
  });

  it("calls custom onClose when provided", async () => {
    const customOnClose = jest.fn();
    function CustomTestComponent() {
      const { showModal, closeModal } = useModal();
      return (
        <div>
          <button onClick={() => showModal("Custom Title", "Custom Message", null, customOnClose)}>
            Show Custom Modal
          </button>
          <button onClick={closeModal}>Close Modal</button>
        </div>
      );
    }
    render(
      <ModalProvider>
        <CustomTestComponent />
      </ModalProvider>
    );
    const showModalButton = screen.getByText("Show Custom Modal");
    await userEvent.click(showModalButton);
    const closeModalButton = screen.getByText("Close Modal");
    await userEvent.click(closeModalButton);
    expect(customOnClose).toHaveBeenCalledTimes(1);
  });
});