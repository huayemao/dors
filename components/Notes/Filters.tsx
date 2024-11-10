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

export const Filters: FC<{
  state: ReturnType<typeof useEntity>;
  dispatch: ReturnType<typeof useEntityDispatch>;
}> = ({ state, dispatch }) => {
  const allTags = Array.from(new Set(state.entityList.flatMap((e) => e.tags)));

  const search = useCallback(
    (v) => {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          ...state.filters,
          content: v,
        },
      });
    },
    [dispatch, state.filters]
  );

  const filterTags = useCallback(
    (v: string[] | undefined) => {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          ...state.filters,
          tags: v,
        },
      });
    },
    [dispatch, state.filters]
  );
  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center gap-2">
        <BaseListbox
          classes={{ wrapper: "flex-[2]" }}
          size="sm"
          label="标签"
          labelFloat
          multiple
          multipleLabel={(v) => {
            return v.length == allTags.length ? "全部" : v.join("、");
          }}
          items={allTags}
          value={state.filters.tags || allTags}
          onChange={(v) => {
            dispatch({
              type: "SET_FILTERS",
              payload: {
                ...state.filters,
                tags: v,
              },
            });
          }}
        />
        <BaseButtonGroup className="">
          <BaseButtonIcon
            size="sm"
            onClick={(e) => {
              filterTags(undefined);
            }}
          >
            <RotateCcwIcon className="size-4"></RotateCcwIcon>
          </BaseButtonIcon>
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
