import { createContext, useState } from "react";

const ModalContext = createContext({});

export const ModalProvider = ({ children }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({});
    const [modalLoading, setModalLoading] = useState(false);

  return (
    <ModalContext.Provider value={{ modalOpen, setModalOpen, modalProps, setModalProps, modalLoading, setModalLoading }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
