import { Modal } from "@/components/Base/Modal";
import { cn } from "@/lib/utils";
import { copyTextToClipboard, withConfirm } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  useState,
} from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { FormFoot } from "@/lib/client/createEntity/FormFoot";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseCollection, BaseEntity } from "./types";
import { AddAction } from "@/components/PostEditor/AddAction";
import { useCloseModal } from "../hooks/useCloseModal";
import { PreviewModal } from "@/components/Base/PreviewModal";

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
    entity: EType,
    options: { preview: boolean }
  ) => ReactNode;
  renderEntityModalActions?: (
    entity: EType,
    options: { preview: boolean }
  ) => ReactNode;
  renderEntity: (entity: EType, options: { preview: boolean, stackMode?: boolean }) => ReactNode;
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
  const [loading, setLoading] = useState(true);
  const [sp] = useSearchParams();
  const isFull = sp.get("view") === "full";

  useEffect(() => {
    if (!entity) {
      return;
    }

    // 设置当前实体
    dispatch({
      type: "ANY",
      payload: {
        currentEntity: entity,
      },
    });
    setLoading(false);

    return () => {
      dispatch({
        type: "ANY",
        payload: {
          entityModalMode: 'view',
          currentEntity: undefined,
        },
      });
    };
  }, [entity, dispatch]);

  const handleRemove = useCallback(() => {
    withConfirm(() => {
      if (currentEntity.id)
        dispatch({
          type: "REMOVE_ENTITY",
          payload: currentEntity.id,
        });
      close();
    })();
  }, [close, currentEntity?.id, dispatch]);

  if (!currentEntity) {
    return <></>
  }

  return (
    <>
      {/* 如果 open 条件写 isFull 会导致 isFull 变为假时，modal 会打开，整个组件卸载不掉 */}
      {!isFull ? (
        <Modal
          key={"modal"}
          open
          onClose={close}
          title={renderEntityModalTitle(currentEntity, { preview: false })}
          className={cn({
            // "max-w-7xl": entityModalMode == "edit",
            // 'h-screen w-screen': isFull,
          })}
          // classes={{
          //   wrapper: cn({
          //     "!hidden h-screen w-screen": isFull,
          //   }),
          // }}
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
                    {renderEntityModalActions(currentEntity, {
                      preview: false,
                    })}
                    {!state.inMemory && (
                      <BaseDropdownItem
                        rounded="md"
                        data-nui-tooltip="删除"
                        title="删除"
                        onClick={handleRemove}
                        start={<Trash className="h-4 w-4" />}
                      ></BaseDropdownItem>
                    )}
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
                {loading ? (
                  <div className="flex justify-center items-center w-full h-32">
                    加载中...
                  </div>
                ) : (
                  renderEntity(currentEntity, { preview: false })
                )}
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
      ) : (
        <PreviewModal key={"modal"} open onClose={close} loading={false}>
          {renderEntity(currentEntity, { preview: false })}
        </PreviewModal>
      )}
    </>
  );
}
