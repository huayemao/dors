import { Modal } from "@/components/Base/Modal";
import { type Question } from "@/lib/types/Question";
import { withConfirm } from "@/lib/utils";
import {
  BaseButton,
  BaseButtonIcon,
  BaseDropdown,
  BaseDropdownItem,
} from "@shuriken-ui/react";
import localforage from "localforage";
import { ArrowLeftIcon, Edit2, Trash } from "lucide-react";
import { FC, PropsWithChildren, ReactNode, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { FormFoot } from "@/lib/client/createEntity/FormFoot";
import {
  BaseCollection,
  BaseEntity,
  EntityDispatch,
  EntityState,
} from "./createEntityContext";
import { AddAction } from "@/components/PostEditor/AddAction";

export default function ViewOrEditEntityModal<
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
  form: Form,
  renderEntityModalTitle = (e) => e.seq,
  renderEntity,
}: {
  renderEntityModalTitle?: (
    entity: BaseEntity,
    options: { preview: boolean }
  ) => ReactNode;
  renderEntity: (
    entity: BaseEntity,
    options: { preview: boolean }
  ) => ReactNode;
  form: FC<PropsWithChildren>;
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
}) {
  const {
    entityModalMode,
    collectionList,
    currentCollection,
    currentEntity,
    entityList,
    modalOpen,
  } = state;

  const { entity } = useLoaderData() as { entity: EType };
  const navigate = useNavigate();
  const cancel = () => {
    dispatch({ type: "CANCEL" });
  };

  useEffect(() => {
    if (!entity) {
      return;
    }
    dispatch({
      type: "SET_ENTITY_MODAL_MODE",
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
        type: "REMOVE_ENTITY",
        payload: currentEntity.id,
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
      title={renderEntityModalTitle(currentEntity, { preview: false })}
      actions={
        <>
          {entityModalMode == "view" ? (
            <BaseDropdown variant="context">
              <BaseDropdownItem
                rounded="md"
                data-nui-tooltip="编辑"
                title="编辑"
                onClick={() => {
                  dispatch({
                    type: "SET_ENTITY_MODAL_MODE",
                    payload: "edit",
                  });
                }}
                start={<Edit2 className="h-4 w-4" />}
              ></BaseDropdownItem>
              <BaseDropdownItem
                rounded="md"
                data-nui-tooltip="删除"
                title="删除"
                onClick={handleRemove}
                start={<Trash className="h-4 w-4" />}
              ></BaseDropdownItem>
            </BaseDropdown>
          ) : (
            <>
              <BaseButtonIcon
                rounded="md"
                size="sm"
                data-nui-tooltip="返回"
                onClick={() => {
                  dispatch({
                    type: "SET_ENTITY_MODAL_MODE",
                    payload: "view",
                  });
                }}
              >
                <ArrowLeftIcon className="h-4 w-4"></ArrowLeftIcon>
              </BaseButtonIcon>
              <AddAction base="../"></AddAction>
            </>
          )}
        </>
      }
    >
      {entityModalMode == "view" ? (
        <div className="md:px-12">
          <div className="flex justify-center w-full ">
            {renderEntity(currentEntity, { preview: false })}
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
