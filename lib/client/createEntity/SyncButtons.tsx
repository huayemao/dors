import { BaseButtonGroup, BaseButtonIcon } from "@shuriken-ui/react";
import { ArrowDownToLineIcon, CloudUpload } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../utils/fetch";
import { EntityState, EntityDispatch } from "./createEntityContext";
import { BaseEntity, BaseCollection } from "./types";

export function SyncButtons<EType extends BaseEntity,
  CType extends BaseCollection & {
    _entityList?: EType[];
    entityList?: EType[];
    updated_at?: string;
  }>(
    { state, dispatch }: { state: EntityState<EType, CType>; dispatch: EntityDispatch<EType, CType>; }) {
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);

  const applyChange = useCallback(
    (res: any) => {
      dispatch({
        type: "SET_CURRENT_COLLECTION",
        payload: res,
      });
    },
    [dispatch]
  );

  const syncFromCloud = useCallback(
    (init?: RequestInit) => {
      if (!state.currentCollection?.id) {
        return;
      }
      setFetching(true);

      return fetchWithAuth("/api/getPost?id=" + state.currentCollection.id, init)
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
    [state.currentCollection?.id]
  );

  useEffect(() => {
    let ignore = false;

    if (state.currentCollection?.online) {
      const id = toast.loading("正在从云端获取数据", {
        position: "bottom-left",
      });
      syncFromCloud()?.then((e) => {
        if (ignore) {
          toast.dismiss(id);
          return;
        }
        // @ts-ignore
        if (e.updated_at == state.currentCollection?.updated_at) {
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
    state.currentCollection?.id,
    syncFromCloud,
    state.currentCollection?.online,
  ]);

  return <BaseButtonGroup>
    {
      // @ts-ignore
      state.currentCollection?.online && (
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
              fd.append("id", state.currentCollection!.id + "");
              fd.append("content", JSON.stringify(state.entityList));
              fd.append("meta", JSON.stringify({
                layout: state.currentCollection?.layout || "masonry"
              }));

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
      )}

  </BaseButtonGroup>;
}