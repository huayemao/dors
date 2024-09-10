import { type Question } from "@/lib/types/Question";
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
  useState,
} from "react";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  BaseCollection,
  BaseEntity,
  EntityDispatch,
  EntityState,
} from "./createEntityContext";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../utils/fetch";

const Filters = ({ dispatch, state }) => {
  return <div></div>;
};

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
  const {
    currentCollection,
    collectionList,
    currentEntity,
    entityList,
    modalOpen,
    entityModalMode,
  } = state;

  const { collection } = useLoaderData() as { collection: CType };
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // console.log(collection);
    if (collection) {
      if (
        collection.id &&
        collectionList.length &&
        collectionList.every((item) => item.id != collection.id)
      ) {
        dispatch({
          type: "SET_COLLECTION_LIST",
          payload: collectionList.concat(collection),
        });
      }

      dispatch({
        type: "SET_CURRENT_COLLECTION",
        payload: collection,
        // payload: Object.assign({}, { ...collection, entityList: undefined }),
      });

      if ((collection as any)._entityList?.length && !entityList.length) {
        const list = (collection as CType & { _entityList: EType[] })
          ._entityList;

        // 覆盖掉本地版本，但只是最初下载时覆盖。
        dispatch({
          type: "SET_ENTITY_LIST",
          payload: list,
        });
      }
    }
  }, [collection, collectionList, dispatch, entityList]);

  const navigate = useNavigate();

  const importQuestionsFromClipBoard = () => {
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
  };

  const copy = (e) => {
    e.preventDefault();
    copyToClipboard(`${JSON.stringify(entityList)}`);
    alert("已复制到剪贴板");
  };

  const syncFromCloud = useCallback(
    (init?: RequestInit) => {
      if (!collection?.id) {
        return;
      }
      setFetching(true);

      return fetchWithAuth("/api/getPost?id=" + collection.id, init)
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
        .then((res) => {
          dispatch({
            type: "SET_COLLECTION_LIST",
            payload: collectionList
              .filter((e) => e.id != collection.id)
              .concat(res),
          });
          toast("同步数据成功");
          return res;
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
    [collection?.id, collectionList, dispatch]
  );

  const Head = slots?.["head"];

  const filters = state.filters;
  let list = state.entityList;
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string") {
      list = list.filter((e) => {
        return e[key].includes(value);
      });
    }
    if (Array.isArray(value)) {
      list = list.filter((e) => {
        if (Array.isArray(e[key])) {
          return e[key].some((item) => value.includes(item));
        }
        return true;
      });
    }
  }

  return (
    <>
      <div className="md:px-12">
        <div className="flex items-center gap-2 border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border border-b-0 rounded-b-none  bg-white transition-all duration-300 rounded-md p-6">
          <div className="inline-flex space-x-2 mr-auto">
            <BaseDropdown label={currentCollection?.name} headerLabel="合集">
              {collectionList?.map((e) => (
                <Link to={"/" + e.id} key={e.id} suppressHydrationWarning>
                  <BaseDropdownItem
                    end={
                      <Link to={"/" + e.id + "/edit"}>
                        <EditIcon className="h-4 w-4"></EditIcon>
                      </Link>
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
              collection?.online && (
                <>
                  <BaseButtonIcon
                    loading={fetching}
                    onClick={() => {
                      syncFromCloud()
                        ?.then?.(() => {
                          dispatch({
                            type: "SET_ENTITY_LIST",
                            // @ts-ignore
                            payload: collection._entityList,
                          });
                        })
                        .catch((e) => {
                          toast(e.message);
                        });
                    }}
                    data-nui-tooltip="同步数据到本地"
                    data-nui-tooltip-position="down"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </BaseButtonIcon>
                  <BaseButtonIcon
                    data-nui-tooltip="同步到云"
                    data-nui-tooltip-position="down"
                    loading={uploading}
                    onClick={() => {
                      setUploading(true);
                      const fd = new FormData();
                      fd.append("id", collection.id + "");
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
                              .filter((e) => e.id != collection.id)
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
            data-nui-tooltip="新建题目"
            data-nui-tooltip-position="down"
            onClick={() => {
              navigate("./create");

              // open();
              // toAddQA();
            }}
          >
            <PlusIcon className="h-4 w-4"></PlusIcon>
          </BaseButtonIcon>
        </div>
        <div className="col-span-12">
          <div className="bg-slate-50 relative w-full border transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8">
            {Head && <Head dispatch={dispatch} state={state}></Head>}
            <div className="max-w-full  masonry sm:masonry-sm md:masonry-md">
              {list.map((e, i, arr) => (
                <Link key={i} to={"./" + e.id}>
                  <BaseCard
                    rounded="md"
                    className=" break-inside-avoid my-3 p-4 lg:px-6"
                  >
                    <div className="relative">
                      {renderEntity(e, { preview: true })}
                    </div>
                  </BaseCard>
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

