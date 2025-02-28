"use client";
import { useModal } from "@/app/context/ModalContext";

export default function Modal() {
  const { modal, closeModal } = useModal();

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-gray-100 p-8 w-80 text-center border border-green-500 rounded-md">
        <h2>{modal.title}</h2>
        <p className="text-sm">{modal.message}</p>
        {modal.onConfirm && (
          <button className="w-24 mt-4" onClick={modal.onConfirm}>Confirm</button>
        )}
        <button className="w-24 mt-4 text-sm" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};