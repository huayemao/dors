import { Modal } from "@/components/Base/Modal";
import { FC, PropsWithChildren, ReactNode, useEffect } from "react";
import { FormFoot } from "./FormFoot";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseCollection, BaseEntity } from "./types";
import { useCloseModal } from "../hooks/useCloseModal";
import { AddAction } from "@/components/PostEditor/AddAction";
import { BaseEntityComponentProps } from "./types/common";
import { useEntityConfig } from "./EntityConfigProvider";

export default function CreateEntityModal<
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
  form: Form,
}: BaseEntityComponentProps<EType, CType> & {
  form: FC<PropsWithChildren>;
}) {
  // 从 Context 中获取配置
  const config = useEntityConfig<EType, CType>();
  const { renderEntityModalTitle = (e) => e.seq } = config;
  const {
    currentCollection,
    collectionList,
    currentEntity: currentQuestion,
    entityList: questionList,
    modalOpen,
    entityModalMode,
  } = state;

  const close = useCloseModal();

  useEffect(() => {
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
    return () => {
      dispatch({ type: "CANCEL" });
    };
  }, [dispatch]);

  return (
    <Modal
      className="max-w-7xl"
      open={modalOpen}
      onClose={close}
      title={renderEntityModalTitle(currentQuestion)}
      actions={<AddAction base="../"></AddAction>}
    >
      <Form>
        <FormFoot />
      </Form>
    </Modal>
  );
}
