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
import { Modal } from "@/components/Base/Modal";

export type CollectionHeaderProps<
  EType extends BaseEntity,
  CType extends BaseCollection
> = {
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
  collectionListHeader?: React.ReactNode;
};

export function CollectionHeader<
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
  Search,
  onSyncFromCloud,
  onSyncToCloud,
  isFetching,
  isUploading,
  collectionListHeader,
}: CollectionHeaderProps<EType, CType>) {
  const headerRef = useRef(null);
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");
  const pinned = usePinned(headerRef, isMobile ? 24 : 20);
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collectionListOpen, setCollectionListOpen] = useState(false);

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

  const isSimple = !state.collectionList;

  const Collections = (
    <div className="top-4 left-0 right-0 w-fit mx-auto">
      {!isSimple && (
        <>
          <BaseButton
            size="sm"
            onClick={() => setCollectionListOpen(true)}
            className={cn("border-none bg-transparent " + c["collection-dropdown"])}
          >
            {state.currentCollection?.name}
          </BaseButton>
          <Modal
            open={collectionListOpen}
            onClose={() => setCollectionListOpen(false)}
            title="合集列表"
            size="lg"
          >
            <div className="space-y-4">
              {collectionListHeader}
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {state.collectionList?.map((e) => (
                  <Link
                    state={{ __NA: {} }}
                    to={"/" + e.id}
                    key={e.id}
                    suppressHydrationWarning
                    className="block"
                  >
                    <div
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted-100 cursor-pointer"
                      onClick={() => setCollectionListOpen(false)}
                    >
                      <div>
                        <div className="font-medium">{e.name}</div>
                        <div className="text-sm text-muted-600">创建于 {new Date(e.id).toLocaleDateString()}</div>
                      </div>
                      <EditIcon
                        onClick={(ev) => {
                          ev.preventDefault();
                          setCollectionListOpen(false);
                          navigate("/" + e.id + "/edit", {
                            state: { __NA: {} },
                          });
                        }}
                        className="h-4 w-4 text-muted-600 hover:text-primary cursor-pointer"
                      />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t">
                <BaseButton
                  color="primary"
                  onClick={() => {
                    setCollectionListOpen(false);
                    navigate("/create");
                  }}
                >
                  <PlusIcon className="mr-2 size-4" />
                  新建合集
                </BaseButton>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );

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
              checked={
                (state.currentCollection?.layout || "masonry") === "masonry"
              }
              onChange={() => {
                dispatch({
                  type: "CREATE_OR_UPDATE_COLLECTION",
                  payload: {
                    ...state.currentCollection!,
                    layout: "masonry",
                    online: state.currentCollection!.online,
                    name: state.currentCollection!.name,
                    id: state.currentCollection!.id,
                  },
                });
              }}
              label="网格布局"
            />
            <BaseRadio
              name="layout"
              value="stack"
              checked={
                (state.currentCollection?.layout || "masonry") === "stack"
              }
              onChange={() => {
                dispatch({
                  type: "CREATE_OR_UPDATE_COLLECTION",
                  payload: {
                    ...state.currentCollection!,
                    layout: "stack",
                    online: state.currentCollection!.online,
                    name: state.currentCollection!.name,
                    id: state.currentCollection!.id,
                  },
                });
              }}
              label="堆叠布局"
            />
            <BaseRadio
              name="layout"
              value="table"
              checked={
                (state.currentCollection?.layout || "masonry") === "table"
              }
              onChange={() => {
                dispatch({
                  type: "CREATE_OR_UPDATE_COLLECTION",
                  payload: {
                    ...state.currentCollection!,
                    layout: "table",
                    online: state.currentCollection!.online,
                    name: state.currentCollection!.name,
                    id: state.currentCollection!.id,
                  },
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
          { "w-fit sticky my-2 ": !isSimple }
        )}
      >
        <div
          className={cn("flex items-center  gap-2 lg:gap-4 relative w-full ", {
            "justify-end lg:max-w-7xl mx-auto ptablet:px-8": isSimple,
            "justify-around": !isSimple,
          })}
        >
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
          <BaseButtonIcon size="sm" onClick={() => setSettingsOpen(true)}>
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
