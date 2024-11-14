import { Modal } from "@/components/Base/Modal";
import { FC, PropsWithChildren, ReactNode, useEffect } from "react";
import { FormFoot } from "./FormFoot";
import {
  EntityDispatch,
  EntityState,
} from "./createEntityContext";
import {
  BaseCollection,
  BaseEntity
} from "./types";
import { useCloseModal } from "../utils/useCloseModal";
import { AddAction } from "@/components/PostEditor/AddAction";

export default function CreateEntityModal<
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
  form: Form,
}: {
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
  form: FC<PropsWithChildren>;
}) {
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
    <Modal open={modalOpen} onClose={close} title={currentQuestion.seq} actions={<AddAction base="../"></AddAction>}>
      <Form>
        <FormFoot />
      </Form>
    </Modal>
  );
}
