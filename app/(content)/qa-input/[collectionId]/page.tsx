"use client";

import { Modal } from "@/components/Base/Modal";
import { useEffect } from "react";
import { useQAs, useQAsDispatch } from "../contexts";
import { QAForm } from "./QAForm";

export default function Collection() {
  const dispatch = useQAsDispatch();
  const cancel = () => {
    dispatch({ type: "CANCEL" });
  };
  const { questionModalMode, currentQuestion, questionList, modalOpen } =
    useQAs();

  useEffect(() => {
    return () => {
      dispatch({ type: "SET_MODAL_OPEN", payload: false });
    };
  }, []);
  return (
    <Modal open={modalOpen} onClose={cancel} title={currentQuestion.seq}>
      <QAForm />
    </Modal>
  );
}
