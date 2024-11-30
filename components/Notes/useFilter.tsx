"use client";
import { useEntity, useEntityDispatch } from "@/contexts/notes";
import { useCallback } from "react";
import { HIDDEN_TAGS, getExcludeIds } from "./NotesContainer";

export function useFilter() {
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const filterTags = useCallback(
    (
      v: string[] | undefined,
      includeNonTags: boolean = false,
      includeArchived: boolean = false
    ) => {
      const filter = includeArchived ? v : { pick: v, omit: HIDDEN_TAGS };
      dispatch({
        type: "SET_FILTERS",
        payload: {
          filters: {
            ...state.filters,
            tags: filter,
          },
          filterConfig: {
            // 避免排除了无标签的
            includeNonKeys: includeNonTags ? ["tags"] : [],
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
