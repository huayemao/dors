import {
  BaseButton,
  BaseIconBox,
  BaseDropdown,
  BaseDropdownItem,
} from "@shuriken-ui/react";
import {
  CopyIcon,
  EditIcon,
  EllipsisIcon,
  MoveUpIcon,
  PlusIcon,
  UploadIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseEntity, BaseCollection } from "./types";
import { SyncButtons } from "./SyncButtons";
import { FC, useCallback, useRef } from "react";
import { cn, readFromClipboard } from "@/lib/utils";
import { copyToClipboard } from "../utils/copyToClipboard";
import { usePinned } from "../hooks/usePinned";
import { useMediaQuery } from "@uidotdev/usehooks";
import c from "@/styles/createEntity.module.css";

interface CollectionHeaderProps<
  EType extends BaseEntity,
  CType extends BaseCollection
> {
  dispatch: EntityDispatch<EType, CType>;
  state: EntityState<EType, CType>;
  Search?: FC<{
    state: EntityState<EType, CType>;
    dispatch: EntityDispatch<EType, CType>;
  }>;
}

export function CollectionHeader<
  EType extends BaseEntity,
  CType extends BaseCollection
>({ dispatch, state, Search }: CollectionHeaderProps<EType, CType>) {
  const headerRef = useRef(null);
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");
  const pinned = usePinned(headerRef, isMobile ? 24 : 20);
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

  const isSimple = !state.collectionList.length

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
          <div className="">
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
            className=" xs:!p-1  xs:w-8 xs:h-8"
          >
            <PlusIcon className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-block">新建</span>
          </BaseButton>
          <BaseDropdown size="lg" rounded="md" variant="context">
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
    </>
  );
}
