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
  BaseInput,
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

import toast from "react-hot-toast";
import { fetchWithAuth } from "../utils/fetch";
import { usePinned } from "@/lib/hooks/usePinned";
import { Modal } from "@/components/Base/Modal";

export default function CollectionLayout<
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
    "filterModal" | "search",
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
  const { currentCollection, collectionList, entityList } = state;
  const { collectionId } = useParams();
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const syncFromCloud = useCallback(
    (init?: RequestInit) => {
      if (!currentCollection?.id) {
        return;
      }
      setFetching(true);

      return fetchWithAuth("/api/getPost?id=" + currentCollection.id, init)
        .then((e) => e.json())
        .then((obj) => {
          return {
            ...obj,
            id: obj.id,
            name: obj.title,
            online: true,
            _entityList: JSON.parse(obj.content),
          };
        })
        .finally(() => {
          setFetching(false);
        });
    },
    [currentCollection?.id]
  );

  useEffect(() => {
    if (!collectionId) {
      return;
    }

    let collection =
      state.collectionList.find((e) => e.id == collectionId) || null;
    if (collectionId != state.currentCollection?.id) {
      if (!collection) {
        fetchWithAuth("/api/getPost?id=" + collectionId)
          .then((e) => e.json())
          .then((obj) => {
            return {
              ...obj,
              id: obj.id,
              name: obj.title,
              online: true,
              _entityList: JSON.parse(obj.content),
            };
          })
          .then((res: CType & { content: string }) => {
            collection = res;
          })
          .catch((error) => {
            console.error("从网络获取数据失败：" + error);
            collection = null;
          })
          .then(() => {
            dispatch({
              type: "SET_CURRENT_COLLECTION",
              payload: collection,
            });
          });
      }
      dispatch({
        type: "SET_CURRENT_COLLECTION",
        payload: collection,
      });
    }
  }, [
    collectionId,
    dispatch,
    state.collectionList,
    state.currentCollection?.id,
  ]);

  useEffect(() => {
    let ignore = false;

    if (currentCollection?.online) {
      const id = toast.loading("正在从云端获取数据", {
        position: "bottom-left",
      });
      syncFromCloud()?.then((e) => {
        if (ignore) {
          toast.dismiss(id);
          return;
        }
        // @ts-ignore
        if (e.updated_at == currentCollection?.updated_at) {
          toast.dismiss(id);
          toast.success("数据已为最新", { position: "bottom-left" });
          return;
        }
        const answer = confirm("已拉取最新版本，是否覆盖本地版本？");
        toast.dismiss(id);
        if (answer) {
          applyChange(e);
          toast.success("同步数据成功");
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [
    applyChange,
    currentCollection?.id,
    syncFromCloud,
    currentCollection?.online,
  ]);

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

  const FilterModal = slots?.["filterModal"];
  const Search = slots?.["search"];

  let list = useMemo(() => state.showingEntityList, [state.showingEntityList]);

  const headerRef = useRef(null);
  const pinned = usePinned(headerRef);

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
            <div className="inline-flex items-end gap-x-2 mr-auto">
              <BaseDropdown label={currentCollection?.name} headerLabel="合集">
                {collectionList?.map((e) => (
                  <Link
                    state={{ __NA: {} }}
                    to={"/" + e.id}
                    key={e.id}
                    suppressHydrationWarning
                  >
                    <BaseDropdownItem
                      suppressHydrationWarning
                      end={
                        <EditIcon
                          onClick={(ev) => {
                            ev.preventDefault();
                            navigate("/" + e.id + "/edit", {
                              state: { __NA: {} },
                            });
                          }}
                          className="h-4 w-4"
                        ></EditIcon>
                      }
                      title={e.name}
                      text={"创建于 " + new Date(e.id).toLocaleDateString()}
                      rounded="sm"
                    />
                  </Link>
                ))}

                <BaseDropdownItem
                  color="primary"
                  classes={{ wrapper: "text-right" }}
                  onClick={() => {
                    navigate("/create");
                  }}
                >
                  <BaseIconBox color="primary">
                    <PlusIcon></PlusIcon>
                  </BaseIconBox>
                </BaseDropdownItem>
              </BaseDropdown>
            </div>
            <div className="hidden md:flex flex-1">
              {Search && <Search dispatch={dispatch} state={state}></Search>}
            </div>
            <BaseButtonGroup>
              {
                // @ts-ignore
                currentCollection?.online && (
                  <>
                    <BaseButtonIcon
                      size="sm"
                      loading={fetching}
                      onClick={() => {
                        syncFromCloud()
                          ?.then?.((res) => {
                            applyChange(res);
                            toast.success("同步数据成功");
                          })
                          .catch((e) => {
                            toast("同步数据失败：" + e.message);
                          });
                      }}
                      data-nui-tooltip="同步数据到本地"
                      data-nui-tooltip-position="down"
                    >
                      <ArrowDownToLineIcon className="h-4 w-4" />
                    </BaseButtonIcon>
                    <BaseButtonIcon
                      size="sm"
                      data-nui-tooltip="同步到云"
                      data-nui-tooltip-position="down"
                      loading={uploading}
                      onClick={() => {
                        setUploading(true);
                        const fd = new FormData();
                        fd.append("id", currentCollection!.id + "");
                        fd.append("content", JSON.stringify(entityList));

                        fetchWithAuth("/api/updatePost", {
                          method: "POST",
                          headers: { accept: "application/json" },
                          body: fd,
                        })
                          .then((res) => res.json())
                          .then((json) => json.data)
                          .then((obj) => {
                            return {
                              ...obj,
                              id: obj.id,
                              name: obj.title,
                              online: true,
                              _entityList: JSON.parse(obj.content),
                            };
                          })
                          .then((res) => {
                            dispatch({
                              type: "SET_CURRENT_COLLECTION",
                              // 把最新的 collection 数据存下来，更新 updated_at 等
                              payload: res,
                            });
                            toast.success("数据上传成功");
                          })
                          .catch((e) => {
                            toast.error("上传失败：" + e?.message);
                          })
                          .finally(() => {
                            setUploading(false);
                          });
                      }}
                    >
                      <CloudUpload className="size-4" />
                    </BaseButtonIcon>
                  </>
                )
              }
              <ActionModal>
                {FilterModal && (
                  <FilterModal dispatch={dispatch} state={state}></FilterModal>
                )}
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
          <div className="w-full md:hidden ">
            {Search && <Search dispatch={dispatch} state={state}></Search>}
          </div>
        </div>
        <div className="col-span-12">
          <div className="relative bg-slate-100  w-full transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8 min-h-[60vh]">
            <div className="max-w-full  masonry sm:masonry-sm md:masonry-md">
              {list.map((e, i, arr) => (
                <Link key={JSON.stringify(e)} to={"./" + e.id}>
                  {renderEntity(e, { preview: true })}
                </Link>
              ))}
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
