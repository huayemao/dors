import {
  BaseButton,
  BaseIconBox,
  BaseDropdown,
  BaseDropdownItem,
  BaseRadio,
  BaseButtonIcon,
} from "@glint-ui/react";
import {
  CopyIcon,
  EditIcon,
  EllipsisIcon,
  MoveUpIcon,
  PlusIcon,
  UploadIcon,
  SettingsIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseEntity, BaseCollection } from "./types";
import { SyncButtons } from "./SyncButtons";
import { FC, useCallback, useRef, useState } from "react";
import { cn, readFromClipboard } from "@/lib/utils";
import { copyToClipboard } from "../utils/copyToClipboard";
import { usePinned } from "../hooks/usePinned";
import { useMediaQuery } from "@uidotdev/usehooks";
import c from "@/styles/createEntity.module.css";
import { SlideDialog } from "@/components/Base/SlideDialog";

export type CollectionHeaderProps<EType extends BaseEntity, CType extends BaseCollection> = {
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
  Search?: FC<{
    state: EntityState<EType, CType>;
    dispatch: EntityDispatch<EType, CType>;
  }>;
  onSyncFromCloud: () => void;
  onSyncToCloud: () => void;
  isFetching: boolean;
  isUploading: boolean;
};

export function CollectionHeader<EType extends BaseEntity, CType extends BaseCollection>({
  state,
  dispatch,
  Search,
  onSyncFromCloud,
  onSyncToCloud,
  isFetching,
  isUploading,
}: CollectionHeaderProps<EType, CType>) {
  const headerRef = useRef(null);
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");
  const pinned = usePinned(headerRef, isMobile ? 24 : 20);
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const exportToClipBoard = useCallback(
    (e) => {
      e.preventDefault();
      copyToClipboard(`${JSON.stringify(state.entityList)}`);
      alert("已复制到剪贴板");
    },
    [state.entityList]
  );

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

  const Collections = (
    <div className="top-4 left-0 right-0 w-fit mx-auto">
      <BaseDropdown
        fixed
        classes={{
          wrapper: "border-none bg-transparent " + c["collection-dropdown"],
          content: "border-none bg-transparent",
        }}
        size={isMobile ? "md" : "lg"}
        label={state.currentCollection?.name}
        variant={isMobile ? "text" : pinned ? "button" : "text"}
        headerLabel="合集"
      >
        {state.collectionList?.map((e) => (
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
                />
              }
              title={e.name}
              text={"创建于 " + new Date(e.id).toLocaleDateString()}
              rounded="sm"
            />
          </Link>
        ))}
        <BaseDropdownItem
          color="primary"
          classes={{ wrapper: "text-right " }}
          onClick={() => navigate("/create")}
        >
          <BaseIconBox color="primary">
            <PlusIcon />
          </BaseIconBox>
        </BaseDropdownItem>
      </BaseDropdown>
    </div>
  );

  const isSimple = state.collectionList && !state.collectionList.length;  

  const SettingsDialog = (
    <SlideDialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">设置</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium">布局模式</label>
          <div className="space-y-2">
            <BaseRadio
              name="layout"
              value="masonry"
              checked={(state.currentCollection?.layout || "masonry") === "masonry"}
              onChange={() => {
                dispatch({
                  type: "CREATE_OR_UPDATE_COLLECTION",
                  payload: {
                    ...state.currentCollection!,
                    layout: "masonry",
                    online: state.currentCollection!.online,
                    name: state.currentCollection!.name,
                    id: state.currentCollection!.id
                  }
                });
              }}
              label="网格布局"
            />
            <BaseRadio
              name="layout"
              value="stack"
              checked={(state.currentCollection?.layout || "masonry") === "stack"}
              onChange={() => {
                dispatch({
                  type: "CREATE_OR_UPDATE_COLLECTION",
                  payload: {
                    ...state.currentCollection!,
                    layout: "stack",
                    online: state.currentCollection!.online,
                    name: state.currentCollection!.name,
                    id: state.currentCollection!.id
                  }
                });
              }}
              label="堆叠布局"
            />
            <BaseRadio
              name="layout"
              value="table"
              checked={(state.currentCollection?.layout || "masonry") === "table"}
              onChange={() => {
                dispatch({
                  type: "CREATE_OR_UPDATE_COLLECTION",
                  payload: {
                    ...state.currentCollection!,
                    layout: "table",
                    online: state.currentCollection!.online,
                    name: state.currentCollection!.name,
                    id: state.currentCollection!.id
                  }
                });
              }}
              label="表格布局"
            />
          </div>
        </div>
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">数据操作</h3>
          <div className="space-y-2">
            <BaseButton
              className="w-full justify-start"
              onClick={exportToClipBoard}
            >
              <CopyIcon className="h-4 w-4 mr-2" />
              导出 JSON
            </BaseButton>
            <BaseButton
              className="w-full justify-start"
              onClick={importQuestionsFromClipBoard}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              导入 JSON
            </BaseButton>
          </div>
        </div>
      </div>
    </SlideDialog>
  );

  return (
    <>
      <div
        ref={headerRef}
        className={cn(
          "mx-auto  rounded top-4 z-10 rounded-t space-y-4 dark:bg-muted-800  transition-all duration-300 px-6 py-3",
          { " bg-white  shadow-lg": !isSimple && pinned },
          { "w-fit sticky my-2 ": !isSimple },
        )}
      >
        <div className={cn("flex items-center  gap-2 lg:gap-4 relative w-full ", {
          "justify-end lg:max-w-7xl mx-auto ptablet:px-8": isSimple,
          "justify-around": !isSimple,
        })}>
          {!isSimple && Collections}
          <div className="flex items-center gap-2">
            {Search && <Search state={state} dispatch={dispatch} />}
            <SyncButtons
              state={state}
              onSyncFromCloud={onSyncFromCloud}
              onSyncToCloud={onSyncToCloud}
              isFetching={isFetching}
              isUploading={isUploading}
            />
          </div>
          <BaseButton
            size="sm"
            color="primary"
            data-nui-tooltip="新建"
            data-nui-tooltip-position="down"
            onClick={() => {
              dispatch({ type: "INIT" });
              navigate("./create");
            }}
            className=" xs:!p-1  xs:w-8 xs:h-8"
          >
            <PlusIcon className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-block">新建</span>
          </BaseButton>
          <BaseButtonIcon
            size="sm"
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon className="h-4 w-4" />
          </BaseButtonIcon>
        </div>
      </div>
      <BaseButton
        variant="solid"
        color="primary"
        rounded="full"
        size="lg"
        shadow="flat"
        className={cn(
          "fixed bottom-4 right-4  z-10 drop-shadow-lg transition-all duration-300 !p-2 w-12",
          {
            "opacity-0": !pinned,
          }
        )}
        onClick={() => window.scrollTo(0, 0)}
      >
        <MoveUpIcon strokeWidth={2} className="size-6"></MoveUpIcon>
      </BaseButton>
      {SettingsDialog}
    </>
  );
}
