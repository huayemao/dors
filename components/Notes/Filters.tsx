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
import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCcwDotIcon,
  RotateCcwIcon,
  TagsIcon,
  XIcon,
} from "lucide-react";
import { HIDDEN_TAGS } from "./NotesContainer";
import { useFilter } from "./useFilter";

let lastTab: string;

export const Filters: FC<{
  state: ReturnType<typeof useEntity>;
  dispatch: ReturnType<typeof useEntityDispatch>;
}> = ({ state, dispatch }) => {
  const { allTags, allUnArchivedTags } = useMemo(() => {
    const allTags = Array.from(
      new Set(
        state.entityList.flatMap((e) => e.tags).filter((e) => !!e?.trim())
      )
    );
    return {
      allTags,
      allUnArchivedTags: allTags.filter((e) => !HIDDEN_TAGS.includes(e)),
    };
  }, [state.entityList]);

  const search = useCallback(
    (v) => {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          filters: {
            ...state.filters,
            content: v,
          },
        },
      });
    },
    [dispatch, state.filters]
  );

  const { filterTags, filterConfig } = useFilter();

  const filterUnArchived = useCallback(() => {
    if (!("tags" in state.filters)) {
      filterTags(allUnArchivedTags, true);
    }
  }, [allUnArchivedTags, filterTags, state.filters]);

  useEffect(() => {
    filterUnArchived();
  }, [filterUnArchived]);

  let text: string = "未选中";
  const ts = state.filters.tags;
  if (!ts) {
    text = "未筛选（默认全选）";
  } else {
    const hasSelected = ts?.length;
    if (hasSelected) {
      const selectedAllUnArchived =
        allUnArchivedTags.sort().toString() == ts.sort().toString() ||
        filterConfig.includeNonKeys?.includes("tags");
      if (selectedAllUnArchived) {
        text = "已选中全部（未归档）";
      } else if (ts.length == allTags.length) {
        text = "已选中全部";
      } else {
        text =
          "已选中" +
          ts.slice(0, 4).join("、").slice(0, 36) +
          "等" +
          ts.length +
          "个标签";
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* TODO: list 长度显示 */}
      <BaseTabSlider
        classes={{ wrapper: "w-32 flex-shrink-0", inner: "!mb-0" }}
        defaultValue={"active"}
        onChange={(v) => {
          if (v === lastTab) {
            return;
          }
          lastTab = v;
          if (v == "active") {
            filterTags(allUnArchivedTags, true);
          } else if (v == "all") {
            filterTags(undefined);
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
            {allTags.map((e) => {
              const isActive = state.filters.tags?.includes(e);
              return (
                <a key={e} href="javascript:void">
                  <BaseTag
                    color={isActive ? "primary" : "default"}
                    onClick={() => {
                      const newList = isActive
                        ? state.filters.tags.filter((t) => t != e)
                        : state.filters.tags?.concat(e) || [e];
                      filterTags(newList);
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
      <BaseInput
        classes={{ wrapper: "flex-1" }}
        label="根据关键字搜索"
        icon="lucide:search"
        onChange={search}
      ></BaseInput>
    </div>
  );
};
