import { Modal } from "@/components/Base/Modal";
import {
  BaseButton,
  BaseDropdown,
  BaseDropdownItem,
  BaseInput,
} from "@shuriken-ui/react";
import { DOMAttributes, useCallback, useEffect, useReducer } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useCloseModal } from "../utils/useCloseModal";
import {
  EntityDispatch,
  EntityState,
} from "./createEntityContext";
import {
  BaseCollection,
  BaseEntity
} from "./types";
import { Trash } from "lucide-react";
import { withConfirm } from "@/lib/utils";

export default function CreateCollectionModal<
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
}: {
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
}) {
  const close = useCloseModal();
  const { currentCollection, collectionList, modalOpen, entityModalMode } =
    state;
  const params = useParams();
  const isEditing = !!params.collectionId;

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "SET_MODAL_OPEN", payload: true });
    }, 100);

    return () => {
      dispatch({ type: "CANCEL" });
    };
  }, [dispatch]);

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
        payload: null,
      });
    }
    return () => {};
  }, [collectionList, dispatch, isEditing, params.collectionId]);

  const handleRemove = () => {
    withConfirm(() => {
      dispatch({
        type: "REMOVE_COLLECTION",
        payload: Number(params.collectionId),
      });
      close();
    });
  };
  return (
    <Modal
      open={modalOpen}
      onClose={close}
      title={currentCollection?.name || "创建合集"}
      actions={
        isEditing ? (
          <>
            <BaseDropdown variant="context">
              <BaseDropdownItem
                rounded="md"
                data-nui-tooltip="删除"
                title="删除"
                onClick={handleRemove}
                start={<Trash className="h-4 w-4" />}
              ></BaseDropdownItem>
            </BaseDropdown>
          </>
        ) : undefined
      }
    >
      <CollectionForm state={state} dispatch={dispatch} />
    </Modal>
  );
}

function CollectionForm<
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
}: {
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
}) {
  const close = useCloseModal();
  const params = useParams();
  const navigate = useNavigate();
  const { currentCollection, collectionList, modalOpen, entityModalMode } =
    state;

  const isEditing = !!params.collectionId;
  const [, forceUpdate] = useReducer((bool) => !bool, false);

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
        payload: null,
      });
    }
    return () => {};
  }, [collectionList, dispatch, isEditing, params.collectionId]);

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = useCallback(
    (e) => {
      e.preventDefault();
      const formEl = e.target as HTMLFormElement;
      const formData = new FormData(formEl);
      const obj = Object.fromEntries(formData.entries()) as {
        name: string;
        id: string;
      };

      const collection = {
        ...obj,
        id: Number(obj.id),
      };

      dispatch({
        type: "CREATE_OR_UPDATE_COLLECTION",
        payload: collection as CType,
      });

      navigate("/" + collection.id, {
        replace: true,
        state: { __NA: {} },
      });
    },
    [dispatch, navigate]
  );

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div className="p-8">
        <input
          className="hidden"
          name="id"
          defaultValue={currentCollection?.id || new Date().valueOf()}
        ></input>
        <BaseInput
          key={currentCollection?.name}
          label="名称"
          id="seq"
          // @ts-ignore
          name="name"
          defaultValue={currentCollection?.name}
        />
        <div className="flex w-full items-center gap-x-2 justify-end">
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2">
              <BaseButton onClick={close} type="button">
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
