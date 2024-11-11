import Prose from "@/components/Base/Prose";
import {
  BaseButton,
  BaseButtonGroup,
  BaseButtonIcon,
  BaseCard,
  BaseInput,
  BaseListbox,
  BaseTag,
} from "@shuriken-ui/react";

import { useEntity, useEntityDispatch } from "@/contexts/notes";
import { FC, Fragment, useCallback, useEffect, useMemo } from "react";
import { RotateCcwIcon, XIcon } from "lucide-react";
import { HIDDEN_TAGS } from "./NotesContainer";
import { useFilter } from "./useFilter";

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

  useEffect(() => {
    filterTags(
      allTags.filter((e) => !HIDDEN_TAGS.includes(e)),
      true
    );
  }, [allTags]);

  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center gap-2">
        {/* TODO: list 长度显示 */}
        <BaseListbox
          classes={{ wrapper: "flex-[2]" }}
          size="sm"
          label="标签"
          labelFloat
          multiple
          multipleLabel={(v) => {
            return allUnArchivedTags.sort().toString() == v.sort().toString() ||
            filterConfig.includeNonKeys?.includes("tags")
              ? "全部（未归档）"
              : v.length == allTags.length
              ? "全部"
              : v.join("、").slice(0, 36) + "...";
          }}
          items={allTags}
          value={state.filters.tags || allTags}
          onChange={filterTags}
        />
        <BaseButtonGroup className="">
          {/* <BaseButtonIcon
            size="sm"
            onClick={(e) => {
              filterTags(undefined);
            }}
          >
            <RotateCcwIcon className="size-4"></RotateCcwIcon>
          </BaseButtonIcon> */}
          <BaseButton
            size="sm"
            onClick={(e) => {
              filterTags(
                allTags.filter((e) => !HIDDEN_TAGS.includes(e)),
                true
              );
            }}
          >
            未归档
          </BaseButton>
          <BaseButton
            size="sm"
            onClick={(e) => {
              filterTags(undefined);
            }}
          >
            全部
          </BaseButton>
          <BaseButtonIcon
            size="sm"
            onClick={() => {
              filterTags([]);
            }}
          >
            <XIcon className="size-4"></XIcon>
          </BaseButtonIcon>
        </BaseButtonGroup>
      </div>
      <BaseInput
        size="sm"
        label="内容"
        icon="lucide:search"
        onChange={search}
        labelFloat
      ></BaseInput>
    </div>
  );
};
