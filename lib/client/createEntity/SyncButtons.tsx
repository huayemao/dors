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
    { state, dispatch, fetchCollection, onSync }: { 
      state: EntityState<EType, CType>; 
      dispatch: EntityDispatch<EType, CType>;
      fetchCollection?: (id: string) => Promise<CType | null>;
      onSync?: (res: CType) => void;
    }) {
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);

  const syncFromCloud = useCallback(
    (init?: RequestInit) => {
      if (!state.currentCollection?.id || !fetchCollection) {
        return;
      }
      setFetching(true);

      return fetchCollection(String(state.currentCollection.id))
        .finally(() => {
          setFetching(false);
        });
    },
    [state.currentCollection?.id, fetchCollection]
  );

  return <BaseButtonGroup>
    {
      state.currentCollection?.online && (
        <>
          <BaseButtonIcon
            size="sm"
            loading={fetching}
            onClick={() => {
              syncFromCloud()
                ?.then?.((res) => {
                  if (!res) return;
                  onSync?.(res);
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