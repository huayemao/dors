import { useCloseModal } from "@/lib/client/hooks/useCloseModal";
import { FC, useState, useEffect, type JSX } from "react";
import { Modal } from "../Base/Modal";

export function withModal<Props>(
    Comp: FC<Props>,
    title: string) {
    return function ModalWrapped(props: JSX.IntrinsicAttributes & Props) {
        const [modalOpen, setModalOpen] = useState(false);
        const close = useCloseModal();
        useEffect(() => {
            setModalOpen(true);
            return () => {
                setModalOpen(false);
            };
        }, []);

        return (
            <Modal title={title} open={modalOpen} onClose={close}>
                <Comp {...props} />
            </Modal>
        );
    };
}
