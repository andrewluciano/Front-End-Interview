// src/context/ModalContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";

// 1. Defina a interface para o contexto
export interface ModalContextProps {
  openModal: (
    content: ReactNode,
    title?: string,
    subtitle?: string,
    larguraModal?: string,
  ) => void;
  closeModal: () => void;
  isModalOpen: boolean;
  TituloModal: string | null;
  SubTituloModal: string | null;
  LarguraModal: string | null;
  AlturaModal: string | null;
  modalContent: ReactNode | null;
}

// 2. Crie o contexto
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// 3. Crie o provedor de contexto
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [TituloModal, setTituloModal] = useState<string | null>(null);
  const [SubTituloModal, setSubTituloModal] = useState<string | null>(null);
  const [LarguraModal, setLarguraModal] = useState<string | null>(null);
  const [AlturaModal, setAlturaModal] = useState<string | null>(null);

  const handleResetParams = () => {
    // const newUrl = window.location.origin + window.location.pathname;
    // window.history.pushState({}, "", newUrl);
    navigate({ search: "" }, { replace: true });
  };

  const openModal = (
    content: ReactNode,
    title?: string,
    subtitle?: string,
    larguraModal?: string,
    alturaModal?: string,
  ) => {
    setModalContent(content);
    setModalOpen(true);
    setTituloModal(title || null);
    setSubTituloModal(subtitle || null);
    setLarguraModal(larguraModal || null);
    setAlturaModal(alturaModal || null);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setTituloModal(null);
    setSubTituloModal(null);
    setLarguraModal(null);
    handleResetParams();
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
        modalContent,
        TituloModal,
        SubTituloModal,
        LarguraModal,
        AlturaModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// 4. Crie o hook customizado
// eslint-disable-next-line react-refresh/only-export-components
export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
