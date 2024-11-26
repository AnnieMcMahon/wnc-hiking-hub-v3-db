"use client";
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    onClose: null,
  });

  function showModal(title, message, onConfirm = null, onClose = null) {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      onClose: onClose || closeModal,
    });
  };

  function closeModal() {
    setModal({ isOpen: false, title: "", message: "", onConfirm: null, onClose: null });
  };

  return (
    <ModalContext.Provider value={{ modal, showModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export function useModal() {
  return useContext(ModalContext);
};