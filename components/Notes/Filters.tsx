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

let lastTab = "all";

const Filters: FC<{
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
      if (!!v)
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
      <BaseInput
        classes={{ wrapper: "flex-1" }}
        label="根据关键字搜索"
        icon="lucide:search"
        onChange={search}
        defaultValue={(state.filters.content as string) || ""}
      ></BaseInput>
    </div>
  );
};

export default memo(Filters);
