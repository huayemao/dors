"use client";
import { useEntity, useEntityDispatch } from "@/contexts/notes";
import { useCallback } from "react";
import { HIDDEN_TAGS, getExcludeIds } from "./NotesContainer";

export function useFilter() {
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const filterTags = useCallback(
    (v: string[] | undefined, includeNonTags: boolean = false) => {
      const hasHiddenTags = v?.some((e) => HIDDEN_TAGS.includes(e));
      const excludeIds = getExcludeIds(hasHiddenTags, state.entityList);

      dispatch({
        type: "SET_FILTERS",
        payload: {
          filters: {
            ...state.filters,
            tags: v,
          },
          filterConfig: {
            // 排除了 归档标签还不够，因为它还会有其他标签
            excludeIds: excludeIds,
            includeNonKeys: includeNonTags ? ["tags"] : [],
            // TODO：筛选未归档小记时却排除了无标签的
          },
        },
      });
    },
    [dispatch, state.filters]
  );
  const filter = {
    filterTags,
    filters: state.filters,
    filterConfig: state.filterConfig,
  };
  return filter;
}
