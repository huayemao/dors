import { Modal } from "@/components/Base/Modal";
import { FC, PropsWithChildren, ReactNode, useEffect } from "react";
import { FormFoot } from "./FormFoot";
import { EntityDispatch, EntityState } from "./createEntityContext";

export default function CreateQuestionModal({
  state,
  dispatch,
  form: Form,
}: {
  state: EntityState;
  dispatch: EntityDispatch;
  form: FC<PropsWithChildren>;
}) {
  const {
    currentCollection,
    collectionList,
    currentEntity: currentQuestion,
    entityList: questionList,
    modalOpen,
    questionModalMode,
  } = state;
  
  useEffect(() => {
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
    return () => {
      dispatch({ type: "CANCEL" });
    };
  }, [dispatch]);

  return (
    <Modal open={modalOpen} onClose={close} title={currentQuestion.seq}>
      <Form>
        <FormFoot />
      </Form>
    </Modal>
  );
}
