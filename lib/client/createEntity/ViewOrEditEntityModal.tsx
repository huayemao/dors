import QA from "@/components/Question";

import { Modal } from "@/components/Base/Modal";
import { type Question } from "@/lib/types/Question";
import { withConfirm } from "@/lib/utils";
import { BaseButton, BaseButtonIcon } from "@shuriken-ui/react";
import localforage from "localforage";
import { Edit2, Trash } from "lucide-react";
import { FC, PropsWithChildren, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { FormFoot } from "@/lib/client/createEntity/FormFoot";
import { BaseEntity, EntityDispatch, EntityState } from "./createEntityContext";

export default function ViewOrEditEntityModal({
  state,
  dispatch,
  form: Form,
}: {
  form: FC<PropsWithChildren>;
  state: EntityState;
  dispatch: EntityDispatch;
}) {
  const {
    questionModalMode,
    collectionList,
    currentCollection,
    currentEntity: currentQuestion,
    entityList: questionList,
    modalOpen,
  } = state;

  const { entity } = useLoaderData() as { entity: BaseEntity };
  const navigate = useNavigate();

  const cancel = () => {
    dispatch({ type: "CANCEL" });
  };

  useEffect(() => {
    if (!entity) {
      return;
    }
    dispatch({
      type: "SET_QUESTION_MODAL_MODE",
      payload: "view",
    });
    dispatch({
      type: "SET_CURRENT_ENTITY",
      payload: entity,
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
            xxx
            {/* <QA data={currentQuestion} /> */}
          </div>
        </div>
      ) : (
        <>
          <Form>
            <FormFoot></FormFoot>
          </Form>
        </>
      )}
    </Modal>
  );
}
