"use client";
import QA from "@/components/Question";

import { Modal } from "@/components/Base/Modal";
import { withConfirm } from "@/lib/utils";
import { BaseButtonIcon } from "@shuriken-ui/react";
import { Edit2, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useQAs, useQAsDispatch } from "../../contexts";
import { QAForm } from "../QAForm";

export const dynamic = "force-static";

export default function Question({
  params,
}: {
  params: {
    questionId: string;
  };
}) {
  const dispatch = useQAsDispatch();

  const {
    questionModalMode,
    collectionList,
    currentCollection,
    currentQuestion,
    questionList,
    modalOpen,
  } = useQAs();

  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    const qid = pathname?.split("/").slice(-1)[0];
    const targetQuestion = questionList.find((e) => e.id == Number(qid));
    if (!targetQuestion) {
      return;
    }
    dispatch({
      type: "SET_CURRENT_QUESTION",
      payload: targetQuestion,
    });
    dispatch({
      type: "SET_MODAL_OPEN",
      payload: true,
    });
    // return () => {
    //   dispatch({ type: "CANCEL" });
    // };
  }, [questionList]);

  const cancel = () => {
    dispatch({ type: "CANCEL" });
    router.replace(pathname!.split("/").slice(0, 3).join("/"));
  };

  const handleRemove = () => {
    withConfirm(() => {
      dispatch({
        type: "REMOVE_QUESTION",
        payload: currentQuestion.id,
      });
      dispatch({ type: "CANCEL" });
    });
  };

  return (
    <Modal
      open={modalOpen}
      onClose={cancel}
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
        <QAForm />
      )}
    </Modal>
  );
}
