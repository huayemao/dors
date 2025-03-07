import { BaseButton, BaseButtonIcon, BaseDropdown, BaseDropdownItem, BaseIconBox } from "@shuriken-ui/react";
import { CopyIcon, EditIcon, EllipsisIcon, PlusIcon, UploadIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseEntity, BaseCollection } from "./types";
import { SyncButtons } from "./SyncButtons";
import { FC, useCallback, useRef } from "react";
import { cn, readFromClipboard } from "@/lib/utils";
import { copyToClipboard } from "../utils/copyToClipboard";
import { usePinned } from "../hooks/usePinned";

interface CollectionHeaderProps<EType extends BaseEntity, CType extends BaseCollection> {
  dispatch: EntityDispatch<EType, CType>;
  state: EntityState<EType, CType>;
  Search?: FC<{
    state: EntityState<EType, CType>;
    dispatch: EntityDispatch<EType, CType>;
  }>;
}

export function CollectionHeader<EType extends BaseEntity, CType extends BaseCollection>({
  dispatch,
  state,
  Search
}: CollectionHeaderProps<EType, CType>) {
  const headerRef = useRef(null);
  const pinned = usePinned(headerRef);
  const navigate = useNavigate();

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

  return (
    <div
      ref={headerRef}
      className={cn(
        "sticky top-[-1px] z-10 rounded-t space-y-4 dark:bg-muted-800  bg-white  transition-all duration-300 p-6",
        { "shadow-lg": pinned }
      )}
    >
      <div className="flex items-center justify-around gap-2  relative w-full ">
        {!!state.collectionList.length &&
          <div className="inline-flex items-end gap-x-2 mr-auto">
            <BaseDropdown label={state.currentCollection?.name} headerLabel="合集">
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
                classes={{ wrapper: "text-right" }}
                onClick={() => navigate("/create")}
              >
                <BaseIconBox color="primary">
                  <PlusIcon />
                </BaseIconBox>
              </BaseDropdownItem>
            </BaseDropdown>
          </div>
        }
        <div className="hidden md:flex flex-1">
          {Search && <Search dispatch={dispatch} state={state} />}
        </div>
        <SyncButtons state={state} dispatch={dispatch} />
        <BaseButton
          size="sm"
          color="primary"
          data-nui-tooltip="新建"
          data-nui-tooltip-position="down"
          onClick={() => {
            dispatch({ type: "INIT" });
            navigate("./create");
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />新建
        </BaseButton>
        <BaseDropdown
          size="lg"
          rounded="md"
          variant="text"
          renderButton={() => (
            <BaseButtonIcon size="sm">
              <EllipsisIcon className="h-4 w-4" />
            </BaseButtonIcon>
          )}
        >
          <BaseDropdownItem
            data-nui-tooltip-position="down"
            onClick={exportToClipBoard}
            start={<CopyIcon className="h-4 w-4" />}
            title="导出"
            text="复制 JSON"
          />
          <BaseDropdownItem
            start={<UploadIcon className="h-4 w-4" />}
            onClick={importQuestionsFromClipBoard}
            title="导入"
            text="导入 JSON"
          />
        </BaseDropdown>
      </div>
      <div className="w-full md:hidden">
        {Search && <Search dispatch={dispatch} state={state} />}
      </div>
    </div>
  );
} 