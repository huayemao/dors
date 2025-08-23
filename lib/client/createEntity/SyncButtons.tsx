import { BaseButtonGroup, BaseButtonIcon } from "@glint-ui/react";
import { ArrowDownToLineIcon, CloudUpload } from "lucide-react";
import { EntityState, EntityDispatch } from "./createEntityContext";
import { BaseEntity, BaseCollection } from "./types";

export function SyncButtons<EType extends BaseEntity,
  CType extends BaseCollection & {
    _entityList?: EType[];
    entityList?: EType[];
    updated_at?: string;
  }>(
    { state, onSyncFromCloud, onSyncToCloud, isFetching, isUploading }: { 
      state: EntityState<EType, CType>; 
      onSyncFromCloud: () => void;
      onSyncToCloud: () => void;
      isFetching: boolean;
      isUploading: boolean;
    }) {
  return <BaseButtonGroup>
    {
      state.currentCollection?.online && (
        <>
          <BaseButtonIcon
            size="sm"
            loading={isFetching}
            onClick={onSyncFromCloud}
            data-nui-tooltip="同步数据到本地"
            data-nui-tooltip-position="down"
          >
            <ArrowDownToLineIcon className="h-4 w-4" />
          </BaseButtonIcon>
          <BaseButtonIcon
            size="sm"
            data-nui-tooltip="同步到云"
            data-nui-tooltip-position="down"
            loading={isUploading}
            onClick={onSyncToCloud}
          >
            <CloudUpload className="size-4" />
          </BaseButtonIcon>
        </>
      )}
  </BaseButtonGroup>;
}