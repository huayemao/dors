import { cn, readFromClipboard, withConfirm } from "@/lib/utils";
import { copyToClipboard } from "@/lib/client/utils/copyToClipboard";
import { AnimatePresence, motion } from "framer-motion";
import {
  BaseButton,
  BaseButtonGroup,
  BaseButtonIcon,
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseIconBox,
} from "@shuriken-ui/react";
import {
  ArrowDownToLineIcon,
  CloudUpload,
  CopyIcon,
  EditIcon,
  EllipsisIcon,
  FilterIcon,
  PlusIcon,
  RefreshCcw,
  UploadIcon,
} from "lucide-react";
import {
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseCollection, BaseEntity } from "./types";

import { usePinned } from "@/lib/client/hooks/usePinned";
import { Modal } from "@/components/Base/Modal";
import { Table } from "@/app/(content)/data-process/Table";
import pick from 'lodash/pick'

export default function ListLayout<
  EType extends BaseEntity,
  CType extends BaseCollection & {
    _entityList?: EType[];
    entityList?: EType[];
    updated_at?: string;
  }
>({
  slots,
  renderEntity,
  state,
  dispatch,
}: {
  slots?: Record<
    "head",
    FC<{
      state: EntityState<EType, CType>;
      dispatch: EntityDispatch<EType, CType>;
    }>
  >;
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
  renderEntity: (
    entity: BaseEntity,
    options: { preview: boolean }
  ) => ReactNode;
}) {
  const { entityList } = state;
  const outlet = useOutlet();

  const applyChange = useCallback(
    (res: any) => {
      dispatch({
        type: "SET_CURRENT_COLLECTION",
        payload: res,
      });
    },
    [dispatch]
  );

  const copy = useCallback(
    (e) => {
      e.preventDefault();
      copyToClipboard(`${JSON.stringify(entityList)}`);
      alert("已复制到剪贴板");
    },
    [entityList]
  );

  const navigate = useNavigate();

  const importQuestionsFromClipBoard = useCallback(() => {
    readFromClipboard().then((text) => {
      try {
        const obj = JSON.parse(text);
        if (obj[0].id) {
          dispatch({ type: "SET_ENTITY_LIST", payload: obj });
          alert("导入成功");
        }
      } catch (error) {
        alert("数据导入错误：" + error.message);
      }
    });
  }, [dispatch]);

  const Head = slots?.["head"];

  let list = useMemo(() => state.showingEntityList, [state.showingEntityList]);

  const headerRef = useRef(null);
  const pinned = usePinned(headerRef);

  console.log(state, list);

  return (
    <>
      <BaseCard shadow="flat" className="">
        <div
          ref={headerRef}
          className={cn(
            "sticky top-[-1px] z-10 rounded-t space-y-4 dark:bg-muted-800  bg-white  transition-all duration-300 p-6",
            { "shadow-lg": pinned }
          )}
        >
          <div className="flex items-center justify-around gap-2  relative w-full ">
            <BaseButtonGroup>
              <ActionModal>
                {Head && <Head dispatch={dispatch} state={state}></Head>}
              </ActionModal>
              <BaseDropdown
                size="lg"
                rounded="md"
                variant="text"
                renderButton={() => (
                  <BaseButtonIcon size="sm">
                    <EllipsisIcon className="h-4 w-4"></EllipsisIcon>
                  </BaseButtonIcon>
                )}
              >
                <BaseDropdownItem
                  data-nui-tooltip-position="down"
                  onClick={copy}
                  start={<CopyIcon className="h-4 w-4"></CopyIcon>}
                  title="导出"
                  text="复制 JSON"
                ></BaseDropdownItem>
                <BaseDropdownItem
                  start={<UploadIcon className="h-4 w-4"></UploadIcon>}
                  onClick={importQuestionsFromClipBoard}
                  title="导入"
                  text="导入 JSON"
                ></BaseDropdownItem>
              </BaseDropdown>
            </BaseButtonGroup>
            <BaseButton
              size="sm"
              color="primary"
              data-nui-tooltip="新建"
              data-nui-tooltip-position="down"
              onClick={() => {
                dispatch({
                  type: "INIT",
                });
                navigate("./create");
                // open();
                // toAddQA();
              }}
            >
              <PlusIcon className="h-4 w-4 mr-2"></PlusIcon>新建
            </BaseButton>
          </div>
        </div>
        <div className="col-span-12">
          <div className="relative bg-slate-100  w-full transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8 min-h-[60vh]">
            <div className="max-w-full  bg-white">
              {list.length !== 0 &&
                <Table data={list.map(e => {
                  const obj = {
                    ...pick(e, ['id', 'name', 'desciption']),
                    ...(e as any).meta,
                  }
                  return obj
                })}
                  canEdit
                  onRowClick={(e) => {
                    navigate("./" + e.id);
                  }}
                  actions={[
                    {
                      title: "编辑",
                      onClick: (e) => {
                        navigate("./" + e.id);
                        setTimeout(() => {
                          dispatch({
                            type: "SET_ENTITY_MODAL_MODE",
                            payload: "edit",
                          });
                        });
                      },
                    },
                  ]}></Table>}
            </div>
          </div>
        </div>
      </BaseCard>
      <AnimatePresence>{outlet}</AnimatePresence>
    </>
  );
}

const ActionModal = ({ children }) => {
  const [active, setActive] = useState(false);
  return (
    <>
      <BaseButtonIcon
        size="sm"
        onClick={() => {
          setActive(true);
        }}
      >
        <FilterIcon className="size-4"></FilterIcon>
      </BaseButtonIcon>
      <AnimatePresence>
        <Modal
          key={String(active)}
          title="筛选"
          open={active}
          onClose={() => {
            setActive(false);
          }}
        >
          {children}
        </Modal>
      </AnimatePresence>
    </>
  );
};
