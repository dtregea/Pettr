import ModalContext from "../context/ModalProvider";
import { useContext } from "react";
const useModal = () => {
    const { modalOpen, setModalOpen, modalProps, setModalProps, modalLoading, setModalLoading } = useContext(ModalContext);

    function closeModal() {
        setModalOpen(false);
        setTimeout(() => setModalProps({}), 300)
    }
    return { ...useContext(ModalContext), closeModal };
}

export default useModal;