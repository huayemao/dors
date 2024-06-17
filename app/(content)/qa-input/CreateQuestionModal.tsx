"use client";
import { Modal } from "@/components/Base/Modal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QAForm } from "./QAForm";
import { useQAs, useQAsDispatch } from "./contexts";

export default function CreateQuestionModal() {
  const dispatch = useQAsDispatch();
  const cancel = () => {
    dispatch({ type: "CANCEL" });
  };
  const navigate = useNavigate();
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
    <Modal
      open={modalOpen}
      onClose={() => {
        if (history.length) {
          navigate(-1);
        } else {
          navigate("..", { replace: true });
        }
      }}
      title={currentQuestion.seq}
    >
      <QAForm />
    </Modal>
  );
}
