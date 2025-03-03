"use client";
import { useModal } from "@/app/context/ModalContext";

export default function Modal() {
  const { modal, closeModal } = useModal();

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-gray-100 p-2 w-80 text-center border border-green-500 rounded-md">
        <h2 className="p-4">{modal.title}</h2>
        <p className="text-sm mx-4 mt-2 mb-4 text-left">{modal.message}</p>
        {modal.onConfirm && (
          <button className="w-24 mx-2 text-sm" onClick={modal.onConfirm}>Confirm</button>
        )}
        <button className="w-24 mx-2 text-sm" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};