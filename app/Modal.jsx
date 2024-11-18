"use client";
import { useModal } from "@/app/context/ModalContext";

export default function Modal() {
  const { modal, closeModal } = useModal();

  if (!modal.isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{modal.title}</h2>
        <p>{modal.message}</p>
        {modal.onConfirm && (
          <button onClick={modal.onConfirm}>Confirm</button>
        )}
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};