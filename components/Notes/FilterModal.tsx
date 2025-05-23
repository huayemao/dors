import Prose from "@/components/Base/Prose";
import {
  BaseButton,
  BaseButtonGroup,
  BaseButtonIcon,
  BaseCard,
  BaseInput,
  BaseInputHelpText,
  BaseListbox,
  BaseParagraph,
  BaseTabSlider,
  BaseTag,
} from "@shuriken-ui/react";

import { useEntity, useEntityDispatch } from "@/contexts/notes";
import {
  FC,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  RefreshCcwDotIcon,
  RotateCcwIcon,
  TagsIcon,
  XIcon,
} from "lucide-react";
import { useFilter } from "./useFilter";
import { cn } from "@/lib/utils";

let lastTab = "all";

const FilterModal: FC<{
  state: ReturnType<typeof useEntity>;
  dispatch: ReturnType<typeof useEntityDispatch>;
}> = ({ state, dispatch }) => {
  const { allTags } = useMemo(() => {
    const allTags = Array.from(
      new Set(
        state.entityList.flatMap((e) => e.tags).filter((e) => !!e?.trim())
      )
    );
    return {
      allTags,
    };
  }, [state.entityList]);

  const search = useCallback(
    (v) => {
      if (v != state.filters.content)
        dispatch({
          type: "SET_FILTERS",
          payload: {
            filters: {
              ...state.filters,
              content: v ?? undefined,
            },
          },
        });
    },
    [dispatch, state.filters]
  );

  const { filterTags, filterConfig } = useFilter();

  let text: string = "未选中";
  let ts = state.filters.tags;
  if (!ts) {
    text = "未筛选（默认全选）";
  } else {
    const tags = typeof ts == "object" ? ("omit" in ts ? ts.pick : ts) : [];
    if (!tags) {
      text = "未筛选（默认全选）";
    } else {
      text =
        "已选中" +
        tags.slice(0, 4).join("、").slice(0, 36) +
        "等" +
        tags.length +
        "个标签";
    }
  }
  // @ts-ignore
  const includeArchived = !state.filters.tags?.omit?.length;

  const value = useMemo(
    () => state.filters.content,
    [state.filters.content]
  ) as string;

  return (
    <div className="space-y-4">
      {/* TODO: list 长度显示 */}
      <BaseTabSlider
        classes={{ wrapper: "w-32 flex-shrink-0", inner: "!mb-0" }}
        key={includeArchived ? "all" : "active"}
        defaultValue={includeArchived ? "all" : "active"}
        onChange={(v) => {
          // 这个组件有个 bug，会在没有 change 的时候触发 change
          if (v === lastTab) {
            return;
          }
          lastTab = v;
          if (v == "active" && includeArchived) {
            filterTags(undefined, true, false);
          } else if (v == "all" && !includeArchived) {
            filterTags(undefined, true, true);
          } else if (v == "null") {
            filterTags([]);
          }
        }}
        tabs={[
          { label: "未归档", value: "active" },
          { label: "全部", value: "all" },
        ]}
      >
        <></>
      </BaseTabSlider>
      <BaseInput
        classes={{ wrapper: "flex-1 relative nui-autocomplete" }}
        icon="lucide:search"
        onChange={search}
        value={value || ""}
        action={
          <button
            type="button"
            tabIndex={-1}
            className={cn(
              "nui-autocomplete-clear absolute right-0  end-0 top-0 z-[1] flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 hover:text-primary-500",
              { '!hidden': !value }
            )}
            onClick={() => search("")}
          >
            <XIcon className="nui-autocomplete-clear-inner" />
          </button>
        }
        // clearable
      ></BaseInput>
      <div className="relative">
        <TagsIcon className="size-5 text-current mb-2"></TagsIcon> 标签
        <BaseCard color="muted" className="p-4 space-y-4">
          <BaseParagraph>{text}</BaseParagraph>
          <BaseButtonGroup className="mb-2">
            <BaseButtonIcon
              size="sm"
              onClick={(e) => {
                filterTags([]);
              }}
            >
              <XIcon className="size-4"></XIcon>
            </BaseButtonIcon>
            <BaseButtonIcon
              size="sm"
              onClick={(e) => {
                filterTags(undefined);
              }}
            >
              <RefreshCcwDotIcon className="size-4"></RefreshCcwDotIcon>
            </BaseButtonIcon>
          </BaseButtonGroup>
          <div className="flex gap-2 flex-wrap">
            {allTags
              .filter((e) => {
                const hidden =
                  typeof ts == "object" && "omit" in ts ? ts.omit : [];
                return !hidden.includes(e);
              })
              .map((e) => {
                const ts = state.filters.tags;
                const tags = ts
                  ? typeof ts == "object"
                    ? "omit" in ts
                      ? ts.pick || []
                      : ts
                    : []
                  : [];

                const isActive = tags.includes(e);
                return (
                  <a key={e} href="javascript:void">
                    <BaseTag
                      color={isActive ? "primary" : "default"}
                      onClick={() => {
                        const newList = isActive
                          ? tags.filter((t) => t != e)
                          : tags.concat(e) || [e];
                        filterTags(
                          newList,
                          undefined,
                          // @ts-ignore
                          !state.filters.tags?.omit?.length
                        );
                      }}
                    >
                      {e}
                    </BaseTag>
                  </a>
                );
              })}
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default memo(FilterModal);
