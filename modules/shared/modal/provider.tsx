"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  cloneElement,
  isValidElement,
} from "react";
import Modal from ".";

interface ModalContextProps {
  show: (content: ReactNode) => void;
  hide: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [showModal, setShowModal] = useState(false);

  const show = (content: ReactNode) => {
    setModalContent(content);
    setShowModal(true);
  };

  const hide = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalContent(null);
    }, 300);
  };

  // Function to preserve context for modal content
  const renderModalContent = () => {
    if (!modalContent) return null;

    // If the content is a React element, clone it to preserve its context
    if (isValidElement(modalContent)) {
      return cloneElement(modalContent, {
        ...(modalContent.props as object),
        key: "modal-content",
      });
    }

    return modalContent;
  };

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      {showModal && (
        <Modal showModal={showModal} setShowModal={setShowModal}>
          {renderModalContent()}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
