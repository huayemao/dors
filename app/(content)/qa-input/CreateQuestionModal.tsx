"use client";
import { Modal } from "@/components/Base/Modal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QAForm } from "./QAForm";
import { useQAs, useQAsDispatch } from "./contexts";
import { BaseButton } from "@shuriken-ui/react";
import { useCloseModal } from "./useCloseModal";

export default function CreateQuestionModal() {
  const dispatch = useQAsDispatch();
  const cancel = () => {
    dispatch({ type: "CANCEL" });
  };
  const close = useCloseModal();
  const {
    currentCollection,
    collectionList,
    currentQuestion,
    questionList,
    modalOpen,
    questionModalMode,
  } = useQAs();
  useEffect(() => {
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
    return () => {
      cancel();
    };
  }, []);
  return (
    <Modal open={modalOpen} onClose={close} title={currentQuestion.seq}>
      <QAForm />
      <div className="sticky bg-white flex w-full items-center gap-x-2 justify-end -bottom-4 left-0 right-0">
        <div className="p-4 md:p-6">
          <div className="flex gap-x-2">
            <BaseButton
              onClick={(e) => {
                e.preventDefault();
                close();
              }}
              type="button"
            >
              取消
            </BaseButton>
            <BaseButton
              type="submit"
              variant="solid"
              color="primary"
              size="md"
              // @ts-ignore
              form="qa"
            >
              确定
            </BaseButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}
