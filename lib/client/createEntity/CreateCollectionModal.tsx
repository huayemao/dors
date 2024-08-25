import { Modal } from "@/components/Base/Modal";
import { BaseButton, BaseInput } from "@shuriken-ui/react";
import { DOMAttributes, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useCloseModal } from "./useCloseModal";
import { EntityDispatch, EntityState } from "./createEntityContext";

export default function CreateCollectionModal({
  state,
  dispatch,
}: {
  state: EntityState;
  dispatch: EntityDispatch;
}) {
  const cancel = () => {
    dispatch({ type: "CANCEL" });
  };
  const close = useCloseModal();
  const { currentCollection, collectionList, modalOpen, questionModalMode } =
    state;
  useEffect(() => {
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
    return () => {
      cancel();
    };
  }, []);

  function CollectionForm({ onClose }) {
    const params = useParams();
    const navigate = useNavigate();
    const { currentCollection, collectionList, modalOpen, questionModalMode } =
      state;
    const isEditing = !!params.collectionId;

    useEffect(() => {
      if (isEditing) {
        const targetItemIndex = collectionList?.findIndex(
          (e) => e.id === Number(params.collectionId)
        );
        const targetCollection = collectionList[targetItemIndex];
        dispatch({ type: "SET_CURRENT_COLLECTION", payload: targetCollection });
      } else {
        dispatch({
          type: "SET_CURRENT_COLLECTION",
          payload: { name: "", id: Date.now() },
        });
      }
      return () => {};
    }, [collectionList, isEditing, params.collectionId]);

    const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = (e) => {
      e.preventDefault();
      const formEl = e.target as HTMLFormElement;
      const formData = new FormData(formEl);
      const obj = Object.fromEntries(formData.entries()) as { name: string };

      const collection = {
        ...currentCollection,
        ...obj,
      };

      dispatch({ type: "CREATE_OR_UPDATE_COLLECTION", payload: collection });

      navigate("/" + collection.id);
    };

    return (
      <form method="POST" onSubmit={handleSubmit}>
        <div className="p-8">
          <BaseInput
            key={currentCollection.id}
            label="名称"
            id="seq"
            // @ts-ignore
            name="name"
            defaultValue={currentCollection.name}
          />
          <div className="flex w-full items-center gap-x-2 justify-end">
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2">
                <BaseButton onClick={onClose} type="button">
                  取消
                </BaseButton>
                <BaseButton
                  type="submit"
                  variant="solid"
                  color="primary"
                  size="md"
                >
                  {" "}
                  确定
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <Modal open={modalOpen} onClose={close} title={currentCollection.name}>
      <CollectionForm onClose={close} />
    </Modal>
  );
}
