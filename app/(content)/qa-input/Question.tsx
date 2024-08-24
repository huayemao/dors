"use client";
import QA from "@/components/Question";

import { Modal } from "@/components/Base/Modal";
import { type Question } from "@/lib/types/Question";
import { withConfirm } from "@/lib/utils";
import { BaseButton, BaseButtonIcon } from "@shuriken-ui/react";
import localforage from "localforage";
import { Edit2, Trash } from "lucide-react";
import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { QAForm } from "./QAForm";
import { useQAs, useQAsDispatch } from "./contexts";

export async function QuestionLoader({ params }) {
  const { questionId, collectionId } = params;
  const questionList = await localforage.getItem(collectionId);
  const question = (questionList as Question[]).find(
    (e) => String(e.id) == questionId
  );
  return {
    question,
  };
}

export default function Question() {
  const dispatch = useQAsDispatch();

  const {
    questionModalMode,
    collectionList,
    currentCollection,
    currentQuestion,
    questionList,
    modalOpen,
  } = useQAs();

  const { question } = useLoaderData() as { question: Question };
  const navigate = useNavigate();

  const cancel = () => {
    dispatch({ type: "CANCEL" });
  };

  useEffect(() => {
    if (!question) {
      return;
    }
    dispatch({
      type: "SET_QUESTION_MODAL_MODE",
      payload: "view",
    });
    dispatch({
      type: "SET_CURRENT_QUESTION",
      payload: question,
    });
    dispatch({
      type: "SET_MODAL_OPEN",
      payload: true,
    });
    return () => {
      cancel();
    };
  }, []);

  const handleRemove = () => {
    withConfirm(() => {
      dispatch({
        type: "REMOVE_QUESTION",
        payload: currentQuestion.id,
      });
      if (history.length) {
        navigate(-1);
      } else {
        navigate("..", { replace: true });
      }
    });
  };

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
      title={"题目" + currentQuestion.seq}
      actions={
        <>
          {questionModalMode == "view" ? (
            <>
              <BaseButtonIcon
                rounded="md"
                size="sm"
                onClick={() => {
                  dispatch({
                    type: "SET_QUESTION_MODAL_MODE",
                    payload: "edit",
                  });
                }}
              >
                <Edit2 className="h-4 w-4" />
              </BaseButtonIcon>
              <BaseButtonIcon rounded="md" size="sm" onClick={handleRemove}>
                <Trash className="h-4 w-4" />
              </BaseButtonIcon>
            </>
          ) : null}
        </>
      }
    >
      {questionModalMode == "view" ? (
        <div className="md:px-12">
          <div className="p-8 flex justify-center w-full ">
            <QA data={currentQuestion} />
          </div>
        </div>
      ) : (
        <>
          <QAForm />
          <div className="sticky bg-white flex w-full items-center gap-x-2 justify-end -bottom-4 left-0 right-0">
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2">
                <BaseButton
                  onClick={(e) => {
                    e.preventDefault();
                    if (history.length) {
                      navigate(-1);
                    } else {
                      navigate("..", { replace: true });
                    }
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
        </>
      )}
    </Modal>
  );
}
