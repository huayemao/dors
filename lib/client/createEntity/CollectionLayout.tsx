import { readFromClipboard, withConfirm } from "@/lib/utils";
import { copyToClipboard } from "@/lib/client/utils/copyToClipboard";
import {
  BaseButton,
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
  useState,
} from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  BaseCollection,
  BaseEntity,
  EntityDispatch,
  EntityState,
} from "./createEntityContext";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../utils/fetch";

export default function CollectionLayout<
  EType extends BaseEntity,
  CType extends BaseCollection
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
  const { currentCollection, collectionList, entityList } = state;
  const { collectionId } = useParams();
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!collectionId) {
      return;
    }

    if (collectionId != state.currentCollection?.id) {
      let collection =
        state.collectionList.find((e) => e.id == collectionId) || null;
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
        .catch((e) => {
          console.log(e.message);
          console.error(e);
          toast("同步数据失败：" + e.message);
        })
        .finally(() => {
          setFetching(false);
        });
    },
    [currentCollection?.id]
  );

  const Head = slots?.["head"];

  let list = useMemo(() => state.showingEntityList, [state.showingEntityList]);


  return (
    <>
      <div className="md:px-12">
        <div className=" space-y-4 border-muted-200 dark:border-muted-700 dark:bg-muted-800 border border-b-0 rounded-b-none  bg-white  transition-all duration-300 rounded-md p-6">
          <div className="flex items-center justify-around gap-2  relative w-full ">
            <div className="inline-flex items-end gap-x-2 mr-auto">
              <BaseDropdown label={currentCollection?.name} headerLabel="合集">
                {collectionList?.map((e) => (
                  <Link to={"/" + e.id} key={e.id} suppressHydrationWarning>
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
                            const targetIndex = collectionList.findIndex(
                              (e) => e.id == res.id
                            );
                            const newList = [...collectionList];
                            if (targetIndex == -1) {
                              newList.push(res);
                            } else {
                              newList[targetIndex] = res;
                            }
                            dispatch({
                              type: "SET_COLLECTION_LIST",
                              payload: newList,
                            });
                            dispatch({
                              type: "SET_CURRENT_COLLECTION",
                              payload: res,
                            });
                            dispatch({
                              type: "SET_ENTITY_LIST",
                              // @ts-ignore
                              payload: res._entityList,
                            });

                            toast("同步数据成功");
                          })
                          .catch((e) => {
                            toast(e.message);
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
                              type: "SET_COLLECTION_LIST",
                              payload: collectionList
                                .filter((e) => e.id != currentCollection!.id)
                                .concat(res),
                            });
                            toast("数据上传成功");
                          })
                          .catch((e) => {
                            toast("上传失败：" + e?.message);
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
            </div>
            <BaseDropdown variant="context">
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
            <BaseButtonIcon
              color="primary"
              rounded="md"
              size="sm"
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
              <PlusIcon className="h-4 w-4"></PlusIcon>
            </BaseButtonIcon>
          </div>
          {Head && <Head dispatch={dispatch} state={state}></Head>}
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
        <Outlet />
      </div>
    </>
  );
}
