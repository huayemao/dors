import { Modal } from "@/components/Base/Modal";
import { cn } from "@/lib/utils";
import { copyTextToClipboard, withConfirm } from "@/lib/utils";
import {
  BaseButton,
  BaseButtonIcon,
  BaseDropdown,
  BaseDropdownItem,
} from "@shuriken-ui/react";
import { ArrowLeftIcon, Edit2, Trash } from "lucide-react";
import {
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { FormFoot } from "@/lib/client/createEntity/FormFoot";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseCollection, BaseEntity } from "./types";
import { AddAction } from "@/components/PostEditor/AddAction";
import { useCloseModal } from "../hooks/useCloseModal";

export default function ViewOrEditEntityModal<
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
  form: Form,
  renderEntityModalTitle = (e) => e.seq,
  renderEntityModalActions = () => <></>,
  renderEntity,
}: {
  renderEntityModalTitle?: (
    entity: BaseEntity,
    options: { preview: boolean }
  ) => ReactNode;
  renderEntityModalActions?: (
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

  const close = useCloseModal();

  const { entityId, collectionId } = useParams();
  const entity = entityList.find((e) => String(e.id) == entityId);

  const cancel = useCallback(() => {
    if (state.modalOpen) {
      dispatch({ type: "CANCEL" });
    }
  }, [dispatch, state.modalOpen]);

  useEffect(() => {
    if (!entity) {
      return;
    }
    dispatch({
      type: "ANY",
      payload: {
        entityModalMode: "view",
        currentEntity: entity,
      },
    });
  }, [cancel, dispatch, entity]);

  useEffect(() => {
    if (!state.modalOpen) {
      dispatch({
        type: "ANY",
        payload: {
          modalOpen: true,
        },
      });
    }

    return () => {
      cancel();
    };
  }, [cancel, dispatch]);

  const handleRemove = useCallback(() => {
    withConfirm(() => {
      dispatch({
        type: "REMOVE_ENTITY",
        payload: currentEntity.id,
      });
      close();
    })();
  }, [close, currentEntity.id, dispatch]);

  return (
    <Modal
      open={modalOpen}
      onClose={close}
      title={renderEntityModalTitle(currentEntity, { preview: false })}
      className={cn({ "max-w-7xl": entityModalMode == "edit" })}
      actions={
        <>
          {entityModalMode == "view" ? (
            <>
              <BaseButtonIcon
                rounded="md"
                size="sm"
                data-nui-tooltip="编辑"
                onClick={() => {
                  dispatch({
                    type: "SET_ENTITY_MODAL_MODE",
                    payload: "edit",
                  });
                }}
              >
                <Edit2 className="h-4 w-4"></Edit2>
              </BaseButtonIcon>
              <BaseDropdown variant="context">
                {renderEntityModalActions(currentEntity, { preview: false })}
                <BaseDropdownItem
                  rounded="md"
                  data-nui-tooltip="删除"
                  title="删除"
                  onClick={handleRemove}
                  start={<Trash className="h-4 w-4" />}
                ></BaseDropdownItem>
              </BaseDropdown>
            </>
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
